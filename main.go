package main

import (
	"listtg/controllers"
	"listtg/initializers"
	"listtg/middleware"

	"github.com/gin-gonic/gin"
)

func Init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

	Init()

	// rout v1 api
	api := r.Group("/api/v1")

	public := api.Group("/bot")
	{
		public.GET("/", controllers.GetApprovedApplications)       // получаем все одобренные боты
		public.POST("/addApplication", controllers.AddApplication) // отправляем заявку на добавление бота
	}

	auth := api.Group("/auth")
	{
		auth.POST("/login", controllers.Login)                              // авторизуемся
		auth.GET("/validate", middleware.RequireAuth, controllers.Validate) // проверяем токен
		auth.POST("/logout", controllers.Logout)                            // выходим из админки
	}

	admin := api.Group("/admin")
	admin.Use(middleware.RequireAuth)
	{
		admin.GET("/", controllers.GetAllApplications)            // возвращаем все заявки
		admin.DELETE("/delete", controllers.DeleteApplication)    // удаляем заявку
		admin.PUT("/update", controllers.UpdateApplicationStatus) // обновляем статус заявки
	}

	r.Run()
}
