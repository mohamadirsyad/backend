import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, query, body } = req;

  try {
    if (method === "GET") {
      if (query.id) {
        // GET /products?id=123
        const id = parseInt(query.id);
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product)
          return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
      }
      // GET /products
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    }

    if (method === "POST") {
      const { name, price } = body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: "Name and price required" });
      }
      const product = await prisma.product.create({
        data: { name, price: Number(price) },
      });
      return res.status(201).json(product);
    }

    if (method === "PATCH") {
      if (!query.id)
        return res.status(400).json({ message: "Product id required" });
      const id = parseInt(query.id);
      const { name, price } = body;
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(price !== undefined && { price: Number(price) }),
        },
      });
      return res.status(200).json(updated);
    }

    if (method === "DELETE") {
      if (!query.id)
        return res.status(400).json({ message: "Product id required" });
      const id = parseInt(query.id);
      await prisma.product.delete({ where: { id } });
      return res.status(200).json({ message: "Deleted successfully" });
    }

    // Jika method lain
    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
