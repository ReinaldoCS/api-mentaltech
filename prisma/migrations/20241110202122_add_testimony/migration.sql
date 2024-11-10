-- CreateTable
CREATE TABLE "testimony" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimony_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "testimony" ADD CONSTRAINT "testimony_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
