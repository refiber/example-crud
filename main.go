package main

import (
	"context"
	"os"
	"os/signal"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/storage/badger/v2"
	_ "github.com/joho/godotenv/autoload"
	refiber "github.com/refiber/framework"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"

	"bykevin.work/refiber/app"
	"bykevin.work/refiber/database"
	"bykevin.work/refiber/routes"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	/**
	 * Log config
	 */
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	isDebug := os.Getenv("DEBUG") == "1"
	if isDebug {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
		zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout}).With().Caller().Logger()
	}

	/**
	 * SessionStorage config
	 * you can also use redis instead: https://docs.gofiber.io/storage
	 */
	storage := badger.New(badger.Config{
		Database:   "./storage/framework/sessions",
		Reset:      false,
		GCInterval: 10 * time.Second,
	})

	refiber, router, support := refiber.New(refiber.Config{
		AppName:        os.Getenv("APP_NAME"),
		SessionStorage: storage,
	})

	db := database.New()

	app := app.New(support, db)
	routes.RegisterWeb(router, app)

	refiber.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).Render("404", nil)
	})

	go func() {
		if err := refiber.Listen(":" + os.Getenv("PORT")); err != nil {
			log.Fatal().Err(err).Send()
		}
	}()

	<-ctx.Done()
	stop()
	log.Info().Msg("shutdown")

	if err := refiber.Shutdown(); err != nil {
		log.Fatal().Err(err).Send()
	}
}
