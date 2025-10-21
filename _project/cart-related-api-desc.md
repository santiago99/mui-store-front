I'll create a brief description of all the available cart API endpoints with their parameters and expected results.

## Cart API Endpoints

### 1. **GET /api/v1/cart** - View Cart
**Description**: Retrieve all cart items for the authenticated user

**Parameters**: None

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "quantity": 2,
      "product": {
        "id": 5,
        "title": "Product Name",
        "price": "29.99",
        "imageUrl": "https://example.com/image.jpg"
      },
      "created_at": "2025-10-17 20:23:25",
      "updated_at": "2025-10-17 20:23:25"
    }
  ]
}
```

---

### 2. **POST /api/v1/cart** - Add Item to Cart
**Description**: Add a product to the cart or update quantity if product already exists

**Parameters**:
```json
{
  "product_id": 5,
  "quantity": 2
}
```

**Response**: Single cart item object (same structure as above)

**Behavior**: 
- If product doesn't exist in cart: creates new cart item
- If product exists: adds quantity to existing item

---

### 3. **PATCH /api/v1/cart/{cartItem}** - Update Cart Item
**Description**: Update the quantity of a specific cart item

**Parameters**:
```json
{
  "quantity": 5
}
```

**Response**: Updated cart item object

**Authorization**: User can only update their own cart items

---

### 4. **DELETE /api/v1/cart/{cartItem}** - Remove Cart Item
**Description**: Remove a specific item from the cart

**Parameters**: None

**Response**: `204 No Content`

**Authorization**: User can only delete their own cart items

---

### 5. **POST /api/v1/cart/merge** - Merge localStorage Cart
**Description**: Merge items from client-side localStorage with database cart

**Parameters**:
```json
{
  "items": [
    {
      "product_id": 5,
      "quantity": 2
    },
    {
      "product_id": 8,
      "quantity": 1
    }
  ]
}
```

**Response**: Complete updated cart (array of cart items)

**Behavior**:
- For existing products: adds quantities together
- For new products: creates new cart items
- Returns the complete merged cart

---

## Authentication Requirements

All cart endpoints require authentication via `auth:sanctum` middleware. Unauthenticated requests will receive `401 Unauthorized`.

## Error Responses

**Validation Errors** (`422 Unprocessable Entity`):
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "product_id": ["The product id field is required."],
    "quantity": ["The quantity must be at least 1."]
  }
}
```

**Authorization Errors** (`403 Forbidden`):
```json
{
  "message": "Unauthorized access to cart item"
}
```

**Not Found** (`404 Not Found`):
```json
{
  "message": "No query results for model [App\\Models\\CartItem] {cartItem_id}"
}
```

## Usage Flow

1. **Anonymous User**: Stores cart in localStorage
2. **User Logs In**: Call `POST /api/v1/cart/merge` to merge localStorage cart with database
3. **Authenticated User**: All cart operations persist to database
4. **Cart Management**: Use CRUD endpoints to manage cart items

This API provides complete cart functionality for both anonymous and authenticated users with seamless merging capabilities.