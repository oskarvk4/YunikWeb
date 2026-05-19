"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProducts() {
  revalidatePath("/shop");
  revalidatePath("/", "layout");
}
