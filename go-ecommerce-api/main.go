package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Price       float64   `json:"price" gorm:"not null"`
	Stock       int       `json:"stock" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

var db *gorm.DB

func initDB() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"))

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db.AutoMigrate(&Product{})
	log.Println("Database connected and migrated")
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	var products []Product
	db.Find(&products)
	json.NewEncoder(w).Encode(products)
}

func getProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.ParseUint(vars["id"], 10, 32)

	var product Product
	if err := db.First(&product, id).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(product)
}

func createProduct(w http.ResponseWriter, r *http.Request) {
	var product Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db.Create(&product)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

func updateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.ParseUint(vars["id"], 10, 32)

	var product Product
	if err := db.First(&product, id).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	product.ID = uint(id)
	db.Save(&product)
	json.NewEncoder(w).Encode(product)
}

func deleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.ParseUint(vars["id"], 10, 32)

	if err := db.Delete(&Product{}, id).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

func main() {
	godotenv.Load()

	initDB()

	r := mux.NewRouter()
	r.HandleFunc("/health", healthCheck).Methods("GET")
	r.HandleFunc("/api/products", getProducts).Methods("GET")
	r.HandleFunc("/api/products/{id}", getProduct).Methods("GET")
	r.HandleFunc("/api/products", createProduct).Methods("POST")
	r.HandleFunc("/api/products/{id}", updateProduct).Methods("PUT")
	r.HandleFunc("/api/products/{id}", deleteProduct).Methods("DELETE")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
