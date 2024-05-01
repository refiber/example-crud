package app

import (
	"github.com/refiber/framework/support"
	"gorm.io/gorm"
)

/**
 * you can add other services here like S3, etc
 * and then you can access it as receiver in all controllers & middlewares
 */

type App struct {
	support.Refiber
	DB *gorm.DB
}

func New(support support.Refiber, db *gorm.DB) *App {
	return &App{support, db}
}
