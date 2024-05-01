package models

import (
	"time"
)

type Category struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
