import { createClient } from 'redis';

let redisClient;

export const initRedis = async () => {
    if (process.env.NODE_ENV !== 'test') {
        try {
            redisClient = createClient({
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 3) return new Error('Redis connection failed');
                        return 500;
                    }
                }
            });
            redisClient.on('error', (err) => console.log('Redis Client Error', err));
            await redisClient.connect();
            console.log('Connected to Redis');
        } catch (error) {
            console.error('Could not connect to Redis, caching will be disabled:', error.message);
            redisClient = null;
        }
    }
};

export const clearCache = async (keyPrefix) => {
    if (!redisClient || !redisClient.isReady) return;
    try {
        const keys = await redisClient.keys(`${keyPrefix}*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

export const cache = (durationInSeconds) => {
    return async (req, res, next) => {
        if (!redisClient || !redisClient.isReady) return next();

        const key = `cache:${req.originalUrl || req.url}:${req.user ? req.user._id : 'public'}`;

        try {
            const cachedResponse = await redisClient.get(key);

            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            } else {
                res.sendResponse = res.json;
                res.json = (body) => {
                    redisClient.setEx(key, durationInSeconds, JSON.stringify(body));
                    res.sendResponse(body);
                };
                next();
            }
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};
