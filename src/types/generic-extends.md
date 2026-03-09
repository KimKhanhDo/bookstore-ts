# TypeScript `extends` — 2 cách dùng khác nhau

## Cách 1 — `extends` để kế thừa (interface inheritance)

Dùng khi muốn **một interface có tất cả properties của interface khác**, rồi thêm vào.

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    bark(): void;
}

// Dog có tất cả của Animal + thêm bark()
const dog: Dog = {
    name: 'Rex', // ✅ từ Animal
    bark: () => console.log('Woof'), // ✅ của Dog
};
```

---

## Cách 2 — `extends` để ràng buộc Generic (constraint)

Dùng khi muốn **giới hạn T chỉ được là những kiểu thỏa mãn điều kiện**.

```typescript
// Không có constraint — T có thể là BẤT CỨ THỨ GÌ
function print<T>(value: T) {
    console.log(value.length); // ❌ TypeScript báo lỗi
    // vì T có thể là number, boolean... không có .length
}

// Có constraint — T phải là thứ có .length
function print<T extends { length: number }>(value: T) {
    console.log(value.length); // ✅
}

print('hello'); // ✅ string có .length
print([1, 2, 3]); // ✅ array có .length
print(123); // ❌ number không có .length
```

---

## Tóm lại

| Cú pháp                 | Dùng khi nào                           |
| ----------------------- | -------------------------------------- |
| `interface A extends B` | Kế thừa — A có tất cả properties của B |
| `<T extends Something>` | Ràng buộc — T phải thỏa mãn điều kiện  |

---

## Ứng dụng thực tế — `axios.d.ts`

File này dùng **Cách 1** (kế thừa), không phải constraint.

```typescript
export interface AxiosResponse<T = any> extends Promise<T> {}
```

### Tại sao cần làm vậy?

Axios định nghĩa sẵn `http.post<T>()` trả về:

```typescript
post<T>(url): Promise<AxiosResponse<T>>
//            ↑ bọc thêm 1 lớp AxiosResponse — KHÔNG phải Promise<T>
```

Vì vậy khi `await` mà không có `axios.d.ts`:

```typescript
const res = await http.post<IBackendRes<ILogin>>(url);
// TypeScript nghĩ res là: AxiosResponse<IBackendRes<ILogin>>
// → muốn lấy data phải: res.data.message ❌ (không khớp với runtime)
```

Nhưng trong `axios.ts`, interceptor đã **bóc `.data` ra rồi**:

```typescript
return response.data; // runtime trả về IBackendRes<ILogin> luôn
```

**Vấn đề:** Runtime trả về `IBackendRes<ILogin>`, TypeScript lại nghĩ là `AxiosResponse<IBackendRes<ILogin>>` → 2 thứ không khớp nhau.

### Giải pháp

```typescript
// AxiosResponse<T> kế thừa Promise<T>
export interface AxiosResponse<T = any> extends Promise<T> {}
```

TypeScript bây giờ hiểu:

```
Promise<AxiosResponse<T>>
→ AxiosResponse<T> là Promise<T>
→ Promise<Promise<T>>
→ await Promise<Promise<T>> = T ✅
```

Kết quả:

```typescript
const res = await http.post<IBackendRes<ILogin>>(url);
// TypeScript hiểu res là IBackendRes<ILogin> ✅
res.message; // ✅
res.statusCode; // ✅
res.data?.access_token; // ✅
```

### Tóm lại một câu

> `AxiosResponse<T>` kế thừa `Promise<T>` để TypeScript **tự động unwrap** thành `T` khi `await` —
> khớp với những gì interceptor thực sự trả về ở runtime.
