package web

import (
	"errors"

	"bykevin.work/refiber/app/models"
	support "github.com/refiber/framework/support"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

func (web *webController) Login(s support.Refiber) error {
	return web.inertia.Render().Page("Login", nil)
}

func (web *webController) Auth(s support.Refiber) error {
	type Auth struct {
		Email    string `validate:"required,email"`
		Password string `validate:"required,min=3"`
	}
	auth := new(Auth)

	if err := s.GetCtx().BodyParser(auth); err != nil {
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	if err := s.Validate(auth); err != nil {
		return s.Redirect().Back().Now()
	}

	var errorFields []*support.ValidationErrorField

	var user models.User
	if err := web.db.First(&user, "email = ?", auth.Email).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			log.Error().Err(err).Msg("AuthController.Auth")
			return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
		}

		e := support.ValidationErrorField{Name: "email", Message: "Email not found"}
		errorFields = append(errorFields, &e)
	} else if user.Password != auth.Password {
		// TODO: hash password
		e := support.ValidationErrorField{Name: "password", Message: "Invalid password"}
		errorFields = append(errorFields, &e)
	}

	if len(errorFields) > 0 {
		s.CreateValidationErrors(errorFields)
		return s.Redirect().Back().Now()
	}

	_user := models.User{ID: user.ID}

	if err := s.NewAuthenticatedUserSession(_user); err != nil {
		return s.Redirect().To("/").WithMessage(support.MessageTypeError, "Something was wrong, please try again later").Now()
	}

	/**
	 * when redirecting with message, it also will pass data, flash: { type: 'success', message: 'Welcome!'} in your props
	 * open Layout.tsx to see how flash message implemented
	 * you can use support.AuthRedirection(s, "/") instead to redirect without message
	 */
	return support.AuthRedirectionWithMessage(s, "/", support.MessageTypeSuccess, "Welcome!")
}

func (web *webController) Logout(s support.Refiber) error {
	s.DestroyAuthenticatedUserSession()
	return s.Redirect().Back().WithMessage(support.MessageTypeError, "Goodbye 👋").Now()
}
