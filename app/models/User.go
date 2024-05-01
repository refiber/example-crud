package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID        uint         `json:"id" gorm:"primarykey"`
	Name      string       `json:"name"`
	Email     string       `json:"email"`
	Password  string       `json:"-"`
	Role      string       `json:"role"`
	CreatedAt time.Time    `json:"createdAt"`
	UpdatedAt time.Time    `json:"updatedAt"`
	DeletedAt sql.NullTime `json:"-" gorm:"index"`
}
