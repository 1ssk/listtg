package initializers

import (
	"listtg/models"
)

func SyncDatabase() {

	DB.AutoMigrate(&models.Application{}, &models.User{})

}
