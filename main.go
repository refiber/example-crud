package main

import (
	"context"
	"os"
	"os/signal"

	refiber "github.com/refiber/framework"

	"bykevin.work/refiber/app"
	"bykevin.work/refiber/database"
	"bykevin.work/refiber/routes"
	_ "github.com/joho/godotenv/autoload"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
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

	refiber, router, support := refiber.New(refiber.Config{
		AppName: os.Getenv("APP_NAME"),
	})

	db := database.New()

	app := app.New(support, db)
	routes.RegisterWeb(router, app)

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
