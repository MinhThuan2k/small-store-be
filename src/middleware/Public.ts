import { SetMetadata } from '@nestjs/common';

export const ROUTE_PUBLIC_KEY = 'route_public';

export const Public = () => SetMetadata(ROUTE_PUBLIC_KEY, true);
