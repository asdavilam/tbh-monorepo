// Inyección de dependencias manual
// Crea repositorios e inyecta en UseCases — sin singletons ocultos

import {
  SupabaseProductRepository,
  SupabaseInventoryRecordRepository,
  SupabasePurchaseRepository,
  SupabaseUserRepository,
  SupabaseAuthClient,
} from '@tbh/infrastructure';

import type { IAuthService } from '@tbh/application';

import {
  RegisterInventoryUseCase,
  GetProductsByUserUseCase,
  GetAllProductsUseCase,
  RegisterPurchaseUseCase,
  GenerateShoppingListUseCase,
  GetCurrentUserUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  GetAllUsersUseCase,
} from '@tbh/application';

import { supabase } from './supabase';

// Auth client — tipado como IAuthService para no acoplar la UI a la implementación concreta
export const authClient: IAuthService = new SupabaseAuthClient(supabase);

// Repositorios
const productRepo = new SupabaseProductRepository(supabase);
const inventoryRepo = new SupabaseInventoryRecordRepository(supabase);
const purchaseRepo = new SupabasePurchaseRepository(supabase);
const userRepo = new SupabaseUserRepository(supabase);

// Use Cases
export const getCurrentUser = new GetCurrentUserUseCase(userRepo);

export const registerInventory = new RegisterInventoryUseCase(
  inventoryRepo,
  purchaseRepo,
  productRepo
);

export const getProductsByUser = new GetProductsByUserUseCase(productRepo, userRepo);

export const getAllProducts = new GetAllProductsUseCase(productRepo, userRepo);

export const registerPurchase = new RegisterPurchaseUseCase(purchaseRepo, userRepo);

export const generateShoppingList = new GenerateShoppingListUseCase(
  productRepo,
  inventoryRepo,
  purchaseRepo
);

export const createProduct = new CreateProductUseCase(productRepo, userRepo);
export const updateProduct = new UpdateProductUseCase(productRepo, userRepo);
export const deleteProduct = new DeleteProductUseCase(productRepo, userRepo);
export const getAllUsers = new GetAllUsersUseCase(userRepo);
