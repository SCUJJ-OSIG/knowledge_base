

error1:can't resolve dependencies

```code
Nest can't resolve dependencies of the MenuService (?, UserRepository). Please make sure that the argument "MenuRepository" at index [0] is available in the MenuModule context.
```

> 一般是model的问题，你只要写了实体，就需要：在import typeOrmModule.forFeature导入实体

```js
@Module({
  controllers: [MenuController],
  providers: [MenuService,],
  imports:[TypeOrmModule.forFeature([Menu,User])]
})
export class MenuModule {}
```
