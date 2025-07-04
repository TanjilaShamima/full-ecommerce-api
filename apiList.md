# API List

## Auth

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login user
- `POST /auth/verify-user/{id}` — Verify user with OTP
- `POST /auth/forget-pass` — Request password reset
- `POST /auth/reset-pass` — Reset password
- `POST /auth/logout` — Logout user

## Admin

- `GET /admin/users` — Get all users (paginated)
- `PATCH /admin/update-role/{id}` — Update user role by ID
- `POST /admin/approved-role/{id}` — Approve user role by ID

## Craft Type

- `POST /craft-types` — Create a new craft type
- `GET /craft-types` — Get all craft types
- `GET /craft-types/{id}` — Get craft type by ID
- `PUT /craft-types/{id}` — Update craft type by ID
- `DELETE /craft-types/{id}` — Delete craft type by ID

## User

- `GET /users/me` — Get my details
- `GET /users/{id}` — Get user by ID
- `PUT /users/{id}` — Update user by ID
- `DELETE /users/{id}` — Delete user by ID
- `POST /users/update-password` — Set new password using reset token

## Address

- `GET /users/{id}/addresses` — Get all addresses by user ID
- `POST /users/{id}/addresses` — Create address by user ID
- `PUT /users/{id}/addresses/{addressId}` — Update address by user ID
- `DELETE /users/{id}/addresses/{addressId}` — Delete address by user ID

## Artisan

- `GET /users/{id}/artisan` — Get artisan profile by user ID
- `POST /users/{id}/artisan` — Create artisan profile for user
- `PUT /users/{id}/artisan` — Update artisan profile by user ID

## Story

- `POST /users/{id}/stories` — Create a new story for a user
- `GET /users/{id}/stories` — Get all stories for a user
- `GET /users/{id}/stories/{id}` — Get a story by ID
- `PUT /users/{id}/stories/{id}` — Update a story by ID
- `DELETE /users/{id}/stories/{id}` — Delete a story by ID

## Product

- `POST /products` — addProducts
- `GET /products` — getAllProducts
- `GET /products/{id}` — getProductsById
- `PUT /products/{id}` — updateProductsById
- `DELETE /products/{id}` — deleteProductsById

## Reviews

- `POST /reviews` — addNewReview
- `GET /reviews` — getAllReviews
- `GET /reviews/{id}` — getReviewById
- `PUT /reviews/{id}` — updateReviewById
- `DELETE /reviews/{id}` — deleteReviewById

## Cart

- `GET /cart` — getMyCartDetails
- `POST /cart/products/{productId}` — addProductInCart
- `DELETE /cart/products/{productId}` — deleteProductFromCart
- `PATCH /cart/products/{prodId}` — increment or decrement
- `DELETE /cart` — deleteCartById

## Order

- `POST /orders` — createNewOrders
- `GET /orders` — getMyAllOrders
- `GET /orders/{id}` — getOrderById
- `PATCH /orders/{id}/status` — updateOrderStatus
