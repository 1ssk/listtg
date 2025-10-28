package controllers

import (
	"listtg/initializers"
	"listtg/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AddApplication создает новую заявку на добавление бота
func AddApplication(c *gin.Context) {
	var body struct {
		Name             string   `json:"name"`
		Category         string   `json:"category"`
		ShortDescription string   `json:"shortDescription"`
		FullDescription  string   `json:"fullDescription"`
		Link             string   `json:"link"`
		Image            string   `json:"image"`
		Tags             []string `json:"tags"`
		Date             string   `json:"date"`
	}

	// Привязываем данные из запроса
	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Неверный формат данных",
		})
		return
	}

	// Генерируем UUID
	applicationID := uuid.New().String()

	// Создаем заявку с автоматическим статусом "pending"
	application := models.Application{
		ID:               applicationID, // Используем UUID
		Name:             body.Name,
		Category:         body.Category,
		ShortDescription: body.ShortDescription,
		FullDescription:  body.FullDescription,
		Link:             body.Link,
		Image:            body.Image,
		Tags:             body.Tags,
		Date:             body.Date,
		Status:           "pending", // Статус по умолчанию
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	// Сохраняем в базу данных
	result := initializers.DB.Create(&application)

	if result.Error != nil {
		c.JSON(400, gin.H{
			"error": "Ошибка при создании заявки",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":     "Заявка успешно создана",
		"application": application,
	})
}

// GetAllApplications возвращает все заявки
func GetAllApplications(c *gin.Context) {
	var applications []models.Application
	initializers.DB.Find(&applications)

	c.JSON(200, gin.H{
		"applications": applications,
	})
}

// GetPendingApplications возвращает заявки ожидающие модерации
func GetPendingApplications(c *gin.Context) {
	var applications []models.Application
	initializers.DB.Where("status = ?", "pending").Find(&applications)

	c.JSON(200, gin.H{
		"applications": applications,
	})
}

// GetApprovedApplications возвращает одобренные заявки
func GetApprovedApplications(c *gin.Context) {
	var applications []models.Application
	initializers.DB.Where("status = ?", "approved").Find(&applications)

	c.JSON(200, gin.H{
		"applications": applications,
	})
}

// GetApplication возвращает конкретную заявку по ID
func GetApplication(c *gin.Context) {
	id := c.Param("id")

	var application models.Application
	result := initializers.DB.First(&application, "id = ?", id)

	if result.Error != nil {
		c.JSON(404, gin.H{
			"error": "Заявка не найдена",
		})
		return
	}

	c.JSON(200, gin.H{
		"application": application,
	})
}

// UpdateApplicationStatus обновляет статус заявки
func UpdateApplicationStatus(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Status string `json:"status"` // "approved" или "rejected"
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Неверный формат данных",
		})
		return
	}

	// Проверяем валидность статуса
	if body.Status != "approved" && body.Status != "rejected" && body.Status != "pending" {
		c.JSON(400, gin.H{
			"error": "Неверный статус. Допустимые значения: approved, rejected, pending",
		})
		return
	}

	var application models.Application
	result := initializers.DB.First(&application, "id = ?", id)

	if result.Error != nil {
		c.JSON(404, gin.H{
			"error": "Заявка не найдена",
		})
		return
	}

	// Обновляем статус и время обновления
	application.Status = body.Status
	application.UpdatedAt = time.Now()

	initializers.DB.Save(&application)

	c.JSON(200, gin.H{
		"message":     "Статус заявки обновлен",
		"application": application,
	})
}

// DeleteApplication удаляет заявку
func DeleteApplication(c *gin.Context) {
	id := c.Param("id")

	var application models.Application
	result := initializers.DB.Where("id = ?", id).Delete(&application)

	if result.Error != nil || result.RowsAffected == 0 {
		c.JSON(404, gin.H{
			"error": "Заявка не найдена",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Заявка успешно удалена",
	})
}
