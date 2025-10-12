## 安装依赖

```bash
npm install --save @nestjs/swagger swagger-ui-express

```

## 配置swagger 模块

```js
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('海军 记账后台服务')
  .setDescription('你的专属记账服务')
  .setVersion('1.0')
  .build();

export const createSwaggerDocument = (app) => {

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
};

```


* **DocumentBuilder** 是 Swagger 模块中的一个类，用于构建 Swagger 文档的基本信息。

**createSwaggerDocument** 函数接收一个 Nest.js 应用实例 **app** 作为参数。

* **SwaggerModule.createDocument(app, swaggerConfig)** ：根据传入的应用实例和之前构建的文档配置对象，创建 Swagger 文档。
* **SwaggerModule.setup('docs', app, document)** ：将生成的 Swagger 文档设置在指定的路径上（这里是 '/docs'），以便 Swagger UI 可以通过该路径访问文档。

### **DocumentBuilder常用的属性配置**

| 方法                                                           | 描述                         |
| -------------------------------------------------------------- | ---------------------------- |
| `setTitle(title: string)`                                    | 设置文档标题。               |
| `setDescription(description: string)`                        | 设置文档描述。               |
| `setVersion(version: string)`                                | 设置文档版本。               |
| `setTermsOfService(termsOfService: string)`                  | 设置文档服务条款。           |
| `setContact(name: string, url: string, email: string)`       | 设置文档联系信息。           |
| `setLicense(name: string, url: string)`                      | 设置文档许可证信息。         |
| `setExternalDoc(description: string, url: string)`           | 设置外部文档链接。           |
| `addBearerAuth(options: AddBearerAuthOptions, name: string)` | 添加 Bearer Token 认证配置。 |
| `addApiKey(options: AddApiKeyOptions, name: string)`         | 添加 API Key 认证配置。      |
| `addOAuth2(options: AddOAuth2Options, name: string)`         | 添加 OAuth2 认证配置。       |

## 在主模块引入 swagger 模块

```js
//main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  { swaggerConfig, createSwaggerDocument } from './config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  createSwaggerDocument(app);
  await app.listen(3000);
}
bootstrap();

```


### 常用的Swagger 装饰器

| **装饰器**              | **描述**                                             | **使用场景**                                               |
| ----------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| **@ApiTags**            | 为控制器或方法添加标签，用于组织 Swagger UI 文档。         | 标明控制器或方法所属的领域，使文档更易于组织。                   |
| **@ApiOperation**       | 为控制器方法添加操作描述，包括摘要和详细描述。             | 提供关于 API 操作的清晰说明，方便开发者理解 API 的作用。         |
| **@ApiParam**           | 描述路径参数、请求参数或响应参数，包括名称、类型、描述等。 | 提供详细的参数信息，方便开发者正确使用和理解 API。               |
| **@ApiBody**            | 指定请求体的 DTO 类型，用于描述请求体的结构。              | 明确请求体的结构，帮助开发者正确发送请求。                       |
| **@ApiResponse**        | 描述 API 的响应，包括状态码、描述等。                      | 提供关于 API 响应的详细说明，方便开发者处理各种响应情况。        |
| **@ApiBearerAuth**      | 指定请求需要携带 Bearer Token，用于身份验证。              | 在需要身份验证的接口中使用，指定需要提供 Token 信息。            |
| **@ApiProperty**        | 为 DTO 类型的属性添加元数据，如描述、默认值等。            | 提供详细的属性信息，使开发者了解 DTO 对象的结构和约束。          |
| **@ApiQuery**           | 描述查询参数，包括名称、类型、描述等。                     | 用于标识查询参数，使开发者清晰了解 API 的可用查询选项。          |
| **@ApiHeader**          | 描述请求头信息，包括名称、类型、描述等。                   | 提供请求头的详细信息，使开发者正确设置请求头。                   |
| **@ApiExcludeEndpoint** | 标记一个控制器方法不在 Swagger UI 中显示。                 | 在一些特殊情况下，可以使用该装饰器排除不需要在文档中展示的接口。 |



## 在控制器中使用装饰器来标识 swagger

示例：

```js
  @Post()
  @ApiOperation({ summary: '添加流水信息', tags: ['Cost Records'] }) // 添加 API 操作的摘要
  @ApiBody({ type: CreateCostRecordDto }) // 指定请求体的 DTO 类型
  @ApiResponse({ status: 201, }) // 添加成功响应信息
  @ApiResponse({ status: 400, }) // 添加错误响应信息，根据实际需要添加更多
  create(@Body() createCostRecordDto: CreateCostRecordDto) {
    return this.costRecordService.create(createCostRecordDto);
  }

```
