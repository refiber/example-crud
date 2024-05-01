package models

import (
	"database/sql"
	"time"
)

type Product struct {
	ID          uint         `json:"id" gorm:"primarykey"`
	Title       string       `json:"title"`
	Description *string      `json:"description"`
	CategoryID  *int         `json:"-"`
	Category    *Category    `json:"category"`
	CreatedByID uint         `json:"-"`
	CreatedBy   User         `json:"createdBy"`
	CreatedAt   time.Time    `json:"createdAt"`
	UpdatedAt   time.Time    `json:"updatedAt"`
	DeletedAt   sql.NullTime `json:"-" gorm:"index"`
}
