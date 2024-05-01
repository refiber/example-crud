package web

import (
	"bykevin.work/refiber/app/models"
	"github.com/gofiber/fiber/v2"
	support "github.com/refiber/framework/support"
	"github.com/rs/zerolog/log"
)

func (web *webController) Product() *productController {
	return &productController{*web}
}

type productController struct{ webController }

// Displays a page listing the data.
func (c *productController) Index(s support.Refiber) error {
	var products []*models.Product

	if err := c.db.Preload("Category").Preload("CreatedBy").Order("created_at DESC").Find(&products).Error; err != nil {
		log.Error().Err(err).Msg("ProductController.Index")
	}

	return c.inertia.Render().Page("products/Index", &fiber.Map{
		"products": products,
	})
}

// Displays a page for creating new data.
func (c *productController) Create(s support.Refiber) error {
	return c.inertia.Render().Page("products/CreateOrEdit", nil)
}

// Handles a POST request to create new data.
func (c *productController) Store(s support.Refiber) error {
	type FormData struct {
		Title       string `validate:"required,min=3,max=100"`
		Description *string
		CategoryID  *int
	}
	formData := new(FormData)

	// parse request body to formData
	if err := s.GetCtx().BodyParser(formData); err != nil {
		log.Error().Err(err).Msg("ProductController.Store")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// validate formData
	if err := s.Validate(formData); err != nil {
		return s.Redirect().Back().Now()
	}

	// get authenticated user
	var user models.User
	if err := s.GetAuthenticatedUserSession(&user); err != nil {
		log.Error().Err(err).Msg("ProductController.Store")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// save product data to db
	product := models.Product{
		Title:       formData.Title,
		Description: formData.Description,
		CategoryID:  formData.CategoryID,
		CreatedByID: user.ID,
	}
	if err := c.db.Create(&product).Error; err != nil {
		log.Error().Err(err).Msg("ProductController.Store")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	return s.Redirect().To("/products").WithMessage(support.MessageTypeSuccess, "Product successfully created!").Now()
}

// Displays a page showing detailed data.
func (c *productController) Show(s support.Refiber) error {
	return c.inertia.Render().Page("products/Show", nil)
}

// Displays a page for editing existing data.
func (c *productController) Edit(s support.Refiber) error {
	productID := s.GetCtx().Params("id")

	var product models.Product
	if err := c.db.Find(&product, productID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("ProductController.Edit")
	}

	return c.inertia.Render().Page("products/CreateOrEdit", &fiber.Map{
		"product": product,
	})
}

// Handles a PUT request to update data.
func (c *productController) Update(s support.Refiber) error {
	type FormData struct {
		Title       string `validate:"required,min=3,max=100"`
		Description *string
		CategoryID  *int
	}
	formData := new(FormData)

	// parse request body to formData
	if err := s.GetCtx().BodyParser(formData); err != nil {
		log.Error().Err(err).Msg("ProductController.Update")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// validate formData
	if err := s.Validate(formData); err != nil {
		return s.Redirect().Back().Now()
	}

	// get product form db
	productID := s.GetCtx().Params("id")
	var product models.Product
	if err := c.db.Find(&product, productID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("ProductController.Update")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// update product data
	product.Title = formData.Title
	product.Description = formData.Description
	product.CategoryID = formData.CategoryID
	if err := c.db.Save(&product).Error; err != nil {
		log.Error().Err(err).Msg("ProductController.Update")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	return s.Redirect().Back().WithMessage(support.MessageTypeSuccess, "Product successfully updated!").Now()
}

// Handles a DELETE request to delete data.
func (c *productController) Destroy(s support.Refiber) error {
	productID := s.GetCtx().Params("id")
	if err := c.db.Delete(&models.Product{}, productID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("ProductController.Destroy")
	}

	return s.Redirect().To("/products").WithMessage(support.MessageTypeSuccess, "Product successfully deleted!").Now()
}
