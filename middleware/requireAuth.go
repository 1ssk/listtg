package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"listtg/initializers"
	"listtg/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func RequireAuth(c *gin.Context) {
	// Получаем токен из куки
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Authorization cookie required",
		})
		c.Abort()
		return
	}

	// Проверяем SECRET
	secret := os.Getenv("SECRET")
	if secret == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Server configuration error",
		})
		c.Abort()
		return
	}

	// Парсим токен
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token",
		})
		c.Abort()
		return
	}

	// Извлекаем claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token claims",
		})
		c.Abort()
		return
	}

	// Проверяем expiration
	exp, ok := claims["exp"].(float64)
	if !ok || float64(time.Now().Unix()) > exp {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Token expired",
		})
		c.Abort()
		return
	}

	// Ищем пользователя в базе
	var user models.User
	userID := uint(claims["sub"].(float64))
	result := initializers.DB.First(&user, userID)

	if result.Error != nil || user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not found",
		})
		c.Abort()
		return
	}

	// Устанавливаем пользователя в контекст
	c.Set("user", user)
	c.Next()
}

func RequireAdmin(c *gin.Context) {
	// Просто проверяем, что пользователь авторизован
	// Если есть токен - значит админ (у нас только один пользователь - админ)
	_, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Authentication required",
		})
		c.Abort()
		return
	}

	// Если дошли сюда - пользователь админ
	c.Next()
}
