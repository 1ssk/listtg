package controllers

import (
	"net/http"
	"os"
	"time"

	"listtg/initializers"
	"listtg/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	var body models.User
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	var user models.User
	result := initializers.DB.Where("Login = ?", body.Login).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid login or password",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid login or password",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// проверка secret, избегаем паники
	secret := os.Getenv("SECRET")

	if secret == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Server configuration error",
		})
		return
	}
	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user_id": user.ID,
	})
}

func Validate(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "User not found in context",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User validated",
		"user":    user,
	})
}

func Logout(c *gin.Context) {
	c.SetCookie("Authorization", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Успешный выход",
	})
}
