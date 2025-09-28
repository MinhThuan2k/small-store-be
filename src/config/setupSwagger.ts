import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Learn The Jira Clone API Description')
    .setVersion('1.0')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);

  documentFactory.paths = Object.keys(documentFactory.paths)
    .sort((a, b) => {
      const opA = documentFactory.paths[a];
      const opB = documentFactory.paths[b];

      const tagA =
        opA.get?.tags?.[0] ||
        opA.post?.tags?.[0] ||
        opA.put?.tags?.[0] ||
        opA.delete?.tags?.[0] ||
        '';
      const tagB =
        opB.get?.tags?.[0] ||
        opB.post?.tags?.[0] ||
        opB.put?.tags?.[0] ||
        opB.delete?.tags?.[0] ||
        '';

      const firstA = tagA.charAt(0).toLowerCase();
      const firstB = tagB.charAt(0).toLowerCase();

      if (firstA !== firstB) return firstA.localeCompare(firstB);
      return tagA.length - tagB.length;
    })
    .reduce(
      (acc, key) => {
        acc[key] = documentFactory.paths[key];
        return acc;
      },
      {} as typeof documentFactory.paths,
    );

  SwaggerModule.setup('api/docs', app, documentFactory);
  console.log(`Swagger URL: url:${process.env.PORT ?? 3000}/api/docs`);
}
