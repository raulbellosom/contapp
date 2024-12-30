import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function createRoles() {
  const roles = ["Root", "Admin", "User", "Guest"];
  for (const role of roles) {
    const exists = await prisma.role.findFirst({ where: { name: role } });
    if (!exists) {
      await prisma.role.create({ data: { name: role } });
      console.log(`Rol creado: ${role}`);
    }
  }
}

async function createPermissions() {
  const permissions = [
    { name: "view_dashboard", description: "Ver el panel de control" },
    { name: "view_profile", description: "Ver la cuenta de usuario" },
    {
      name: "edit_profile",
      description: "Editar información de la cuenta de usuario",
    },
    { name: "change_password", description: "Cambiar contraseña" },
    { name: "change_profile_image", description: "Cambiar imagen de perfil" },
    { name: "view_users", description: "Ver usuarios" },
    { name: "create_users", description: "Crear usuarios" },
    { name: "edit_users", description: "Editar usuarios" },
    { name: "delete_users", description: "Eliminar usuarios" },
    { name: "view_roles", description: "Ver roles" },
    { name: "create_roles", description: "Crear roles" },
    { name: "edit_roles", description: "Editar roles" },
    { name: "delete_roles", description: "Eliminar roles" },
  ];

  for (const perm of permissions) {
    const exists = await prisma.permission.findUnique({
      where: { name: perm.name },
    });
    if (!exists) {
      await prisma.permission.create({ data: perm });
    }
  }
}

async function assignPermissionsToRoles() {
  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  for (const role of roles) {
    for (const perm of permissions) {
      const exists = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
      });
      if (!exists) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: perm.id },
        });
        console.log(`Permiso ${perm.name} asignado al rol ${role.name}`);
      }
    }
  }
}

async function createRootUser() {
  const rootRole = await prisma.role.findUnique({ where: { name: "Root" } });

  if (!rootRole) {
    console.error("No se encontró el rol Root.");
    return;
  }

  const exists = await prisma.user.findUnique({
    where: { email: "root@contapp.com" },
  });
  if (!exists) {
    const hashedPassword = await bcrypt.hash("adminadmin", 10);
    const rootUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        firstName: "Contapp",
        lastName: "Root",
        userName: "root",
        email: "root@contapp.com",
        password: hashedPassword,
        roleId: rootRole.id,
        enabled: true,
      },
    });
    console.log(`Usuario root creado: ${rootUser.email}`);
  } else {
    console.log("Usuario root ya existe.");
  }
}

async function seedBanks() {
  const banks = [
    "Afirme",
    "American Express",
    "Citibanamex",
    "BanBajio",
    "Banco Azteca",
    "BANCOMEXT",
    "BanCoppel",
    "Banorte",
    "Banregio",
    "BBVA",
    "HSBC",
    "Inbursa",
    "Invex",
    "Monex",
    "Nafin",
    "NU",
    "Plata",
    "Santander",
    "Scotiabank",
  ];

  for (const bank of banks) {
    const exists = await prisma.bank.findUnique({ where: { name: bank } });
    if (!exists) {
      await prisma.bank.create({
        data: {
          name: bank,
          country: "México",
          logo: `public/banks/logos/${bank
            .toLowerCase()
            .replace(/\s+/g, "_")}.jpg`,
        },
      });
      console.log(`Banco creado: ${bank}`);
    }
  }
}

async function main() {
  console.log("Iniciando seeder...");
  await createRoles();
  await createPermissions();
  await assignPermissionsToRoles();
  await createRootUser();
  await seedBanks();
  console.log("Seeder completado.");
}

main()
  .catch((e) => {
    console.error("Error en el seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
