package models

import (
	"time"

	"gorm.io/gorm"
)

type Application struct {
	ID               string    `gorm:"primaryKey;type:uuid" json:"id"`
	Name             string    `gorm:"not null" json:"name"`
	Category         string    `gorm:"not null" json:"category"`
	ShortDescription string    `gorm:"not null" json:"shortDescription"`
	FullDescription  string    `gorm:"not null" json:"fullDescription"`
	Link             string    `gorm:"not null" json:"link"`
	Image            string    `json:"image"`
	Tags             []string  `gorm:"type:text;serializer:json" json:"tags"`
	Date             string    `gorm:"not null" json:"date"`
	Status           string    `gorm:"default:pending" json:"status"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type User struct {
	gorm.Model
	Login    string `gorm:"unique;not null" json:"login"`
	Password string `gorm:"not null" json:"password"`
}
