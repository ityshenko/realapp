const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Получение списка объявлений
exports.getListings = async (req, res) => {
  try {
    const {
      dealType,
      propertyType,
      rooms,
      minPrice,
      maxPrice,
      district,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const where = {
      status: 'ACTIVE',
    };

    // Фильтры
    if (dealType) where.dealType = dealType;
    if (propertyType) where.propertyType = propertyType;
    if (rooms) where.rooms = parseInt(rooms);
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }
    if (district) where.districtNameRu = { contains: district, mode: 'insensitive' };

    // Сортировка
    const order = {};
    order[sortBy] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Пагинация
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
          owner: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatar: true,
              rating: true,
              isVerified: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: order,
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Ошибка получения списка объявлений' });
  }
};

// Получение объявления по ID
exports.getListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            rating: true,
            isVerified: true,
          },
        },
        favoritedBy: {
          where: { userId: req.user?.id },
          select: { userId: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    // Увеличение счетчика просмотров
    await prisma.listing.update({
      where: { id },
      data: { viewsCount: listing.viewsCount + 1 },
    });

    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Ошибка получения объявления' });
  }
};

// Создание объявления
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      currency,
      dealType,
      propertyType,
      rooms,
      area,
      livingArea,
      kitchenArea,
      floor,
      totalFloors,
      address,
      districtName,
      districtNameRu,
      lat,
      lng,
      hasFurniture,
      hasParking,
      hasElevator,
      hasBalcony,
      isNewBuilding,
      petsAllowed,
      features,
      nearby,
      photos,
    } = req.body;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseInt(price),
        currency: currency || 'RUB',
        dealType,
        propertyType,
        rooms: rooms ? parseInt(rooms) : null,
        area: parseFloat(area),
        livingArea: livingArea ? parseFloat(livingArea) : null,
        kitchenArea: kitchenArea ? parseFloat(kitchenArea) : null,
        floor: floor ? parseInt(floor) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        address,
        districtName,
        districtNameRu,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        hasFurniture: hasFurniture || false,
        hasParking: hasParking || false,
        hasElevator: hasElevator || false,
        hasBalcony: hasBalcony || false,
        isNewBuilding: isNewBuilding || false,
        petsAllowed: petsAllowed || false,
        features: features || [],
        nearby: nearby || null,
        ownerId: req.user.id,
        status: 'MODERATION',
        photos: {
          create: photos?.map((url, index) => ({
            url,
            order: index,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        photos: true,
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Объявление создано и отправлено на модерацию',
      listing,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Ошибка создания объявления' });
  }
};

// Обновление объявления
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Проверка прав владельца
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    if (existingListing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Нет прав для редактирования' });
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...updateData,
        price: updateData.price ? parseInt(updateData.price) : undefined,
        status: 'MODERATION',
      },
      include: {
        photos: true,
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    res.json({
      message: 'Объявление обновлено и отправлено на модерацию',
      listing,
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Ошибка обновления объявления' });
  }
};

// Удаление объявления
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    if (listing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Нет прав для удаления' });
    }

    await prisma.listing.delete({
      where: { id },
    });

    res.json({ message: 'Объявление удалено' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Ошибка удаления объявления' });
  }
};

// Добавить в избранное
exports.addToFavorites = async (req, res) => {
  try {
    const { listingId } = req.body;

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        listingId,
      },
    });

    // Увеличение счетчика избранных
    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { increment: 1 } },
    });

    res.status(201).json({ message: 'Добавлено в избранное', favorite });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Ошибка добавления в избранное' });
  }
};

// Удалить из избранного
exports.removeFromFavorites = async (req, res) => {
  try {
    const { listingId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        listingId,
      },
    });

    // Уменьшение счетчика избранных
    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { decrement: 1 } },
    });

    res.json({ message: 'Удалено из избранного' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Ошибка удаления из избранного' });
  }
};
