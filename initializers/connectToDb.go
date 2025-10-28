package initializers

import (
	"log"

	"gorm.io/driver/sqlite" // Sqlite driver based on CGO
	// "github.com/glebarez/sqlite" // Pure go SQLite driver, checkout https://github.com/glebarez/sqlite for details
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDb() {

	var err error

	// github.com/mattn/go-sqlite3
	DB, err = gorm.Open(sqlite.Open("data.db"), &gorm.Config{})

	if err != nil {
		log.Panic("Problem connect DB: ", err)
	}
}
