package web

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	support "github.com/refiber/framework/support"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"bykevin.work/refiber/app/models"
)

func (web *webController) Login(s support.Refiber, c *fiber.Ctx) error {
	return web.inertia.Render(c).Page("Login", nil)
}

func (web *webController) Auth(s support.Refiber, c *fiber.Ctx) error {
	type Input struct {
		Email    string `validate:"required,email"`
		Password string `validate:"required,min=3"`
	}
	input := new(Input)

	redirect := s.Redirect(c)

	if err := c.BodyParser(input); err != nil {
		return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	validation := s.Validation(c)

	if err := validation.Validate(input); err != nil {
		return redirect.Back().Now()
	}

	var errorFields []*support.ValidationErrorField

	var user models.User
	if err := web.db.First(&user, "email = ?", input.Email).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			log.Error().Err(err).Msg("AuthController.Auth")
			return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
		}

		e := support.ValidationErrorField{Name: "email", Message: "Email not found"}
		errorFields = append(errorFields, &e)
	} else if user.Password != input.Password {
		// TODO: hash password
		e := support.ValidationErrorField{Name: "password", Message: "Invalid password"}
		errorFields = append(errorFields, &e)
	}

	if len(errorFields) > 0 {
		validation.SetErrors(errorFields)
		return redirect.Back().Now()
	}

	_user := models.User{ID: user.ID}

	auth := s.Auth(c)

	if err := auth.NewAuthenticatedUserSession(_user); err != nil {
		return redirect.To("/").WithMessage(support.MessageTypeError, "Something was wrong, please try again later").Now()
	}

	/**
	 * when redirecting with message, it also will pass data, flash: { type: 'success', message: 'Welcome!'} in your props
	 * open Layout.tsx to see how flash message implemented
	 * you can use auth.RedirectTo("/") instead to redirect without message
	 */
	return auth.RedirectToWithMessage("/", support.MessageTypeSuccess, "Welcome!")
}

func (web *webController) Logout(s support.Refiber, c *fiber.Ctx) error {
	s.Auth(c).DestroyAuthenticatedUserSession()
	return s.Redirect(c).Back().WithMessage(support.MessageTypeError, "Goodbye 👋").Now()
}
