package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(secret string) gin.HandlerFunc {

	return func(c *gin.Context) {

		header := c.GetHeader(
			"Authorization",
		)

		if header == "" {

			c.JSON(401, gin.H{
				"error": "unauthorized",
			})

			c.Abort()
			return
		}

		tokenString := strings.Split(
			header,
			" ",
		)[1]

		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (
				interface{},
				error,
			) {

				return []byte(secret), nil
			},
		)

		if err != nil {

			c.JSON(401, gin.H{
				"error": "invalid token",
			})

			c.Abort()
			return
		}

		claims :=
			token.Claims.(jwt.MapClaims)

		c.Set(
			"user_id",
			claims["user_id"],
		)

		c.Next()
	}
}
