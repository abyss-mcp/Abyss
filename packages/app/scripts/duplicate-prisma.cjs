const fs = require('fs-extra');
const path = require('path');

module.exports = async function duplicatePrisma(context) {
    const prismaSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', 'prisma');
    const prismaDest1 = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'prisma', 'source');
    const prismaDest2 = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'node_modules', 'prisma');

    const prismaPkgSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', '@prisma');
    const prismaPkgDest = path.join(
        context.appOutDir,
        'Abyss.app',
        'Contents',
        'Resources',
        'app.asar.unpacked',
        'node_modules',
        '@prisma'
    );

    const prismaClientSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', '.prisma');
    const prismaClientDest = path.join(
        context.appOutDir,
        'Abyss.app',
        'Contents',
        'Resources',
        'app.asar.unpacked',
        'node_modules',
        '.prisma'
    );

    console.log('Copying Prisma from', prismaSrc, 'to', prismaDest1);
    console.log('Copying Prisma from', prismaSrc, 'to', prismaDest2);
    console.log('Copying Prisma Client from', prismaClientSrc, 'to', prismaClientDest);
    console.log('Copying Prisma Package from', prismaPkgSrc, 'to', prismaPkgDest);
    // Copy Prisma to first destination
    try {
        // Check if source and destination are the same before copying
        if (prismaSrc !== prismaDest1) {
            await fs.copy(prismaSrc, prismaDest1);
        } else {
            console.log('Prisma source and destination are the same. Skipping copy.', { prismaSrc, prismaDest1 });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma to first destination:', err);
        throw err;
    }

    // Copy Prisma to second destination
    try {
        if (prismaSrc !== prismaDest2) {
            await fs.copy(prismaSrc, prismaDest2);
        } else {
            console.log('Prisma source and destination are the same. Skipping copy.', { prismaSrc, prismaDest2 });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma to second destination:', err);
        throw err;
    }

    // Copy Prisma Client
    try {
        if (prismaClientSrc !== prismaClientDest) {
            await fs.copy(prismaClientSrc, prismaClientDest);
        } else {
            console.log('Prisma Client source and destination are the same. Skipping copy.', { prismaClientSrc, prismaClientDest });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma Client:', err);
        throw err;
    }

    // Copy Prisma Package
    try {
        if (prismaPkgSrc !== prismaPkgDest) {
            await fs.copy(prismaPkgSrc, prismaPkgDest);
        } else {
            console.log('Prisma Package source and destination are the same. Skipping copy.', { prismaPkgSrc, prismaPkgDest });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma Package:', err);
        throw err;
    }

    console.log('Prisma duplication complete.');
};
