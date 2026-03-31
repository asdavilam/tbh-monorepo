// Inyección de dependencias manual
// Crea repositorios e inyecta en UseCases — sin singletons ocultos

import {
  SupabaseProductRepository,
  SupabaseInventoryRecordRepository,
  SupabasePurchaseRepository,
  SupabaseUserRepository,
} from '@tbh/infrastructure';

import {
  RegisterInventoryUseCase,
  GetProductsByUserUseCase,
  RegisterPurchaseUseCase,
  GenerateShoppingListUseCase,
} from '@tbh/application';

import { supabase } from './supabase';

// Repositorios
const productRepo = new SupabaseProductRepository(supabase);
const inventoryRepo = new SupabaseInventoryRecordRepository(supabase);
const purchaseRepo = new SupabasePurchaseRepository(supabase);
const userRepo = new SupabaseUserRepository(supabase);

// Use Cases
export const registerInventory = new RegisterInventoryUseCase(
  inventoryRepo,
  purchaseRepo,
  productRepo
);

export const getProductsByUser = new GetProductsByUserUseCase(productRepo, userRepo);

export const registerPurchase = new RegisterPurchaseUseCase(purchaseRepo, userRepo);

export const generateShoppingList = new GenerateShoppingListUseCase(
  productRepo,
  inventoryRepo,
  purchaseRepo
);
