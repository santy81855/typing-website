/*
  Warnings:

  - You are about to drop the column `accuracy` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `numWords` on the `Result` table. All the data in the column will be lost.
  - Added the required column `characterAccuracy` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpm` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numCorrectCharacters` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numCorrectWords` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numIncorrectCharacters` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numIncorrectWords` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordAccuracy` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wpmRaw` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "accuracy",
DROP COLUMN "numWords",
ADD COLUMN     "characterAccuracy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cpm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "numCorrectCharacters" INTEGER NOT NULL,
ADD COLUMN     "numCorrectWords" INTEGER NOT NULL,
ADD COLUMN     "numIncorrectCharacters" INTEGER NOT NULL,
ADD COLUMN     "numIncorrectWords" INTEGER NOT NULL,
ADD COLUMN     "wordAccuracy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "wpmRaw" DOUBLE PRECISION NOT NULL;
