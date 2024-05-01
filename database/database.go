package database

import (
	"bykevin.work/refiber/app/models"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func New() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("./database/db.sqlite"), &gorm.Config{Logger: logger.Default.LogMode(logger.Error)})
	if err != nil {
		log.Error().Err(err).Msg("database.New")
	}

	// I don't like auto migrate
	db.AutoMigrate(&models.User{}, models.Category{}, models.Product{})

	// TODO: has password
	user := models.User{ID: 1, Name: "Taylor otwell", Email: "taylor@mail.com", Password: "password123", Role: "MASTER"}
	db.Create(&user)

	categories := []*models.Category{
		{ID: 1, Title: "Laptop"},
		{ID: 2, Title: "Handphone"},
		{ID: 3, Title: "Smart Band"},
	}
	db.Create(categories)

	description1 := "The MacBook Pro with Apple silicon is a line of Mac notebook computers first introduced in November 2020 by Apple Inc. It is the higher-end model of the MacBook family, sitting above the consumer-focused MacBook Air, and is currently sold with 14-inch and 16-inch screens. All models use Apple-designed M-series systems on a chip."
	description2 := "The Google Pixel 6a is an Android smartphone designed, developed, and marketed by Google as part of the Google Pixel product line. It serves as a mid-range variant of the Pixel 6 and Pixel 6 Pro. The device was announced on May 11, 2022 as part of Google I/O"
	description3 := "The Xiaomi Smart Band 8 is a wearable activity tracker produced by Xiaomi Inc. It was launched in China on 18 April 2023 and on 26 October 2023 for the global market. It has a 1.62-inch screen with 490 x 192 pixels resolution, a 24/7 heart rate monitor and a SpO2 sensor. It also comes with a NFC variant."
	products := []*models.Product{
		{ID: 1, Title: "MacBook Pro M1", Description: &description1, CategoryID: &categories[0].ID, CreatedByID: user.ID},
		{ID: 2, Title: "Google Pixel 6a", Description: &description2, CategoryID: &categories[1].ID, CreatedByID: user.ID},
		{ID: 3, Title: "Xiaomi Smart Band 8", Description: &description3, CategoryID: &categories[2].ID, CreatedByID: user.ID},
	}
	db.Create(products)

	return db
}
