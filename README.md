# skyhook
A typesafe dependency injection framework for javscript written in typescript which allows for asynchonous service instantiation. All functions are fully typed based on the application context provided.

1. Create your service interfaces
```typescript
interface EmployeeRepository {
    store(employee: Employee): void
    get(id: number): Employee
}

interface EmployeeGreeterService {
    greet(id: number): string
}
```

2. Create your context interface
```typescript
interface AppContext {
    employeeRepository: EmployeeRespository
    employeeGreeterService: EmployeeGreeterService
}
```

3. Configure your Skyhook instance
```typescript
const skyhook = new Skyhook<AppContext>();
skyhook.addService('employeeRepository', () => new EmployeeRespositoryImpl() );

skyhook.addService('employeeGreeterService', employeeRepository => {
    return new EmployeeGreeterServiceImpl(employeeRepository);
}, ['employeeRepository']);
```

4. Create and use your skyhook context
```typescript
const context = await skyhook.initialize();
const greeter = context.get('employeeGreeterService');
console.log(greeter.greet(1));
```


