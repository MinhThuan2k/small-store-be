import { getCurrentUserId } from '@/common/helpers/function';
import { Prisma } from '@prisma/client';

const IS_DELETED = 1;
const IS_NON_DELETED = 0;

const softDeleteModels = new Set([
  'Category',
  'SubCategory',
  'User',
  'Product',
]);

export const softDelete = Prisma.defineExtension({
  name: 'SoftDelete',
  model: {
    $allModels: {
      trashed<M, A>(
        this: M,
        args: Prisma.Args<M, 'findMany'>,
      ): Promise<Prisma.Result<M, A, 'findMany'>> {
        const context = Prisma.getExtensionContext(this);
        const modelName = context.$name;
        if (!softDeleteModels.has(modelName)) {
          throw new Error(`Model ${modelName} not support soft delete`);
        }

        return (context as any).findMany(addDeletedFilter(args, IS_DELETED));
      },
      restore<M, A>(
        this: M,
        args: Prisma.Args<M, 'updateMany'>,
      ): Promise<Prisma.Result<M, A, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);
        const modelName = context.$name;
        if (!softDeleteModels.has(modelName)) {
          throw new Error(`Model ${modelName} not support soft delete`);
        }

        return (context as any).updateMany({
          ...addDeletedFilter(args, IS_DELETED),
          data: {
            deleted: IS_NON_DELETED,
            deletedAt: null,
          },
        });
      },
      async $allOperations({ model, operation, args, query }) {
        if (!softDeleteModels.has(model)) return query(args);

        // Read operations: automatically filter deleted = false
        if (isReadOperation(operation)) {
          if (operation === 'findUnique') operation = 'findFirst';
          args = addDeletedFilter(args, IS_NON_DELETED);
        }

        const { overwriteOperation, newArgs } = getOperationArgs(
          operation,
          args,
        );

        operation = overwriteOperation;
        args = newArgs;

        return query({ ...args, operation });
      },
    },
  },
});

function ensureArgs(args?: any) {
  return args ?? {};
}

function addDeletedFilter(args: any, deletedValue: number) {
  const newArgs = { ...(args ?? {}) };
  newArgs.where = {
    ...(newArgs.where ?? {}),
    deleted: deletedValue,
    deletedAt: deletedValue === IS_NON_DELETED ? null : { not: null },
  };
  return newArgs;
}

function isReadOperation(
  operation: string,
): operation is
  | 'findUnique'
  | 'findFirst'
  | 'findUniqueOrThrow'
  | 'findFirstOrThrow'
  | 'findMany'
  | 'count'
  | 'aggregate' {
  return [
    'findUnique',
    'findFirst',
    'findUniqueOrThrow',
    'findFirstOrThrow',
    'findMany',
    'count',
    'aggregate',
  ].includes(operation);
}

function getOperationArgs(
  operation: string,
  args: any,
): { overwriteOperation: string; newArgs: any } {
  const map = {
    delete: {
      overwriteOperation: 'update',
      newArgs: operationDelete(args),
    },
    deleteMany: {
      overwriteOperation: 'updateMany',
      newArgs: operationDelete(args),
    },
    update: {
      overwriteOperation: 'update',
      newArgs: operationUpdate(args),
    },
    updateMany: {
      overwriteOperation: 'updateMany',
      newArgs: operationUpdate(args),
    },
    create: {
      overwriteOperation: 'create',
      newArgs: operationCreate(args),
    },
  } as const;

  return map[operation] ?? { overwriteOperation: operation, newArgs: args };
}

function operationDelete(args: any) {
  const userId = getCurrentUserId();
  return {
    ...ensureArgs(args),
    data: {
      ...((args as any)?.data ?? {}),
      deleted: IS_DELETED,
      deletedAt: new Date(),
      updatedBy: userId,
    },
  };
}
function operationCreate(args: any) {
  const userId = getCurrentUserId();
  return {
    ...ensureArgs(args),
    data: {
      ...(args?.data ?? {}),
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

function operationUpdate(args: any) {
  const userId = getCurrentUserId();
  return {
    ...ensureArgs(args),
    data: {
      ...(args?.data ?? {}),
      updatedBy: userId,
      updatedAt: new Date(),
    },
  };
}
