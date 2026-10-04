# Architecture Guide (for AI Coding Agents)

## 1. Purpose

This document defines the architectural rules, folder structure, and code
conventions for this React project. AI coding agents (Cursor, Copilot,
Claude Code, etc.) **must** treat these rules as project-level constraints
when creating, modifying, or refactoring code.

Existing project patterns always take priority over introducing new ones.
If a requested change would require breaking a rule in this document, the
agent should explicitly flag the conflict before making the change (see
§11 Priority Rule).

---

## 2. Top-Level Source Structure

```
src/
├── assets/
│   ├── images/          # raster images (.png, .jpeg, .jpg, .webp, ...)
│   └── svg/              # .svg files only
│
├── common/                # shared infrastructure reused across the whole app
│   ├── helpers/           # generic reusable hooks (not tied to one module)
│   ├── modules/           # shared/base modules (e.g. `list`) reused by feature modules
│   ├── services/          # http client, storage, other app-wide services
│   └── utils/              # reusable hooks/utilities for backend integration
│
├── components/             # reusable, standalone UI components
│
├── modules/                 # feature modules, one per domain concept (auth, users, ...)
│
└── pages/                    # route-level page components
```

Do not introduce additional top-level `src` directories unless the project
architecture is explicitly extended with a new rule.

---

## 3. `assets` Folder

### 3.1 `src/assets/images`

Reserved for raster image assets: `.png`, `.jpeg`, `.jpg`, `.webp`, or other
raster formats when explicitly required.

- Do not place SVG files here.

### 3.2 `src/assets/svg`

Reserved for `.svg` assets.

- Do not place raster images here.

---

## 4. `common` Folder

`src/common` contains reusable infrastructure, backend-integration code, and
generic logic shared across the entire application — not feature-specific
business logic.

```
src/common/
├── helpers/
├── modules/
├── services/
└── utils/
```

### 4.1 `src/common/helpers`

**Purpose:** separates complex, reusable business logic from UI components to
avoid repetitive code and keep the codebase maintainable.

**Structure:**
```
helpers/
├── useSomeHook.ts   # reusable hook logic
├── useOtherHook.ts
└── index.ts         # exports all hook files
```

Rules:
- Only put logic here if it is generic/reusable and not specific to a single
  module.
- `index.ts` must re-export everything in the folder.

### 4.2 `src/common/modules`

Contains reusable **base/shared modules** — types and mappers related to
list-based data handling and the project's `useList` hook pattern (e.g. a
`list` module providing `ListModule.Types` / `ListModule.Mappers` consumed by
feature modules).

Typical responsibilities:
- List-related TypeScript types
- List response types
- List mappers
- Reusable data transformations required by `useList`

Rules:
- When implementing a new feature module that uses `useList`, inspect this
  directory first and reuse existing types/mappers whenever applicable.
- Do not duplicate an existing list type or mapper.

> Note: this is distinct from the top-level `src/modules/` directory (§6),
> which holds per-feature domain modules (auth, users, dashboard, etc.).
> `common/modules` holds the shared building blocks those feature modules
> import from.

### 4.3 `src/common/services`

Reusable, app-wide service-level infrastructure.

```
src/common/services/
├── http.ts
├── storage.ts
└── index.ts
```

**`http.ts`** — the default Axios client configuration, created with
`axios.create()`. Reuse this client throughout the app instead of creating
independent Axios instances unnecessarily.

```ts
import http from "./http";
```

**`storage.ts`** — the default `store2` storage configuration, providing a
centralized storage abstraction reusable wherever app storage is needed. Do
not create a new `store2` configuration when this service is sufficient.

**`index.ts`** — public export entry point for the services directory:

```ts
export { default as http } from "./http";
export { default as storage } from "./storage";
```

When adding another reusable service to this directory, expose it through
`index.ts` if it's meant to be consumed outside its local module.

### 4.4 `src/common/utils`

Reusable hooks and utilities specifically related to backend integration
(API integration behavior, backend communication helpers, reusable
backend-related logic).

Rules:
- Do not place general-purpose UI components here.
- Do not place feature-specific business logic here unless it is genuinely
  reusable and belongs to backend integration.

---

## 5. `components` Folder

`src/components` contains **reusable** UI components used across multiple
features/pages. Keep this directory focused — do not add unrelated
application or feature-specific logic here.

### 5.1 Component Directory Structure

Every reusable component gets its own directory:

```
src/components/Button/
├── Button.tsx
├── Button.module.scss
└── index.ts
```

- **`Button.tsx`** — the component's main implementation file.
- **`Button.module.scss`** — the component's scoped styles (CSS Modules).
- **`index.ts`** — the public export entry point, e.g.:

```ts
export { default } from "./Button";
```

### 5.2 Component Decomposition

Keep implementation inside the main file initially. If it grows large or has
clearly separable internal sections, create a local `components` directory
inside that component's own directory:

```
src/components/Button/
├── Button.tsx
├── Button.module.scss
├── index.ts
└── components/
    ├── ButtonIcon.tsx
    ├── ButtonLabel.tsx
    └── ...
```

Rules:
- The nested `components` directory is local to its parent component.
- Do not move component-specific subcomponents into the global
  `src/components` directory unless they are independently reusable outside
  the parent component.

**Prefer:**
```
Button/
└── components/
    └── ButtonIcon.tsx
```

**Over:**
```
components/
├── Button/
└── ButtonIcon/
```
when `ButtonIcon` exists only to support `Button`.

### 5.3 Component Props

Define props inside the component's main `.tsx` file, named exactly `IProps`:

```tsx
type IProps = {
  variant: "primary" | "secondary";
  children: React.ReactNode;
};
```

- Do not create a separate `types.ts` file for a component's props when they
  are only used by that component.
- Use `IProps` unless there is an explicit project-level reason for another
  established convention.

### 5.4 Component Styling

Use **CSS Modules** for component-specific styles, combined with `clsx` for
conditional/combined class names:

```tsx
import cx from "clsx";
import classes from "./Button.module.scss";

<button className={cx(classes.btn, classes[variant])}>
  ...
</button>
```

Rules:
- Import the component's CSS Module as `classes`.
- Use `clsx` for conditional or combined class names.
- Prefer CSS Module class names over global CSS selectors.
- Do not use inline styles when the style belongs to the component's visual
  design.
- Do not introduce a new styling system when CSS Modules are already the
  established convention.
- Keep component styles inside the component's own directory.
- For components with variants, map variants through CSS Module classes
  rather than constructing global class names manually.

---

## 6. `modules` Folder (Feature Modules)

**Purpose:** each feature module encapsulates all logic for one domain/feature
area of the app (data fetching, forms, types, mapping).

**Example modules:**
```
modules/
├── auth/
├── dashboard/
├── profile/
├── settings/
└── users/
```

### 6.1 Required files/folders inside each module

```
modules/<name>/
├── hooks/
│   ├── useList.tsx
│   ├── useSingle.tsx
│   └── index.ts
├── forms/
│   ├── Create.tsx
│   ├── Update.tsx
│   ├── schema.ts
│   └── index.ts
├── api.ts
├── constants.ts     # optional
├── mappers.ts
├── types.ts
└── index.ts
```

### 6.2 `hooks/` folder

Reusable hooks that make API calls, built with `api.ts`, `mappers.ts`, and
TanStack Query (`@tanstack/react-query`). These typically import shared list
types/mappers from `common/modules` (see §4.2).

**`useList` pattern** (fetches a paginated/filtered list):

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import * as Types from '../types';

import * as ListModule from '@/common/modules/list';

interface IProps {
  params?: ListModule.Types.IEntity.Params;
  enabled?: boolean;
}

const useList = ({ params, enabled = true }: IProps = {}) => {
  const initialData = { results: [] } as Types.IQuery.List;

  const paramsWithDefaults = ListModule.Mappers.Params(params);

  const { data = initialData, ...args } = useQuery<Types.IQuery.List, string, Types.IQuery.List>({
    queryKey: ['movies', 'now_playing', paramsWithDefaults],
    queryFn: async () => {
      const { data } = await Api.List({ params: paramsWithDefaults });
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
    enabled
  });

  return { data: data.results, ...args };
};

export default useList;
```

**`useSingle` pattern** (fetches a single entity by id):

```tsx
import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Types from '../types';
import * as Mappers from '../mappers';

const useSingle = (id: number, enabled = true) => {
  const { data, ...args } = useQuery<Types.IEntity.Movie>({
    queryKey: ['movies', 'single', id],
    queryFn: async () => {
      const { data } = await Api.Single({ id });
      return Mappers.Movie(data);
    },
    enabled: enabled && Boolean(id)
  });

  return { ...args, data };
};

export default useSingle;
```

**`hooks/index.ts`** must export every hook:

```ts
export { default as useList } from './useList';
export { default as useSingle } from './useSingle';
```

### 6.3 `forms/` folder

Reusable forms built with **react-hook-form** for form handling and **zod**
for validation.

Naming convention:
- Form that **creates** (posts new) data → `Create.tsx`
- Form that **updates** existing data → `Update.tsx`

Example (`modules/users/forms/`):
```
forms/
├── Create.tsx   # create user form
├── Update.tsx   # update user form
├── schema.ts    # zod validation schema
└── index.ts     # exports all form files
```

**Form file skeleton:**

```tsx
import React from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import * as Api from '../api';
import * as Types from '../types';
import * as Mappers from '../mappers';

import { validationSchema } from './schema';

interface FormValues extends Types.IForm.Create {}

interface IChildren extends UseFormReturn<FormValues> {
  isLoading?: boolean;
}

interface IProps {
  children: (props: IChildren) => React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IForm.Create) => void;
}

const defaults: Types.IForm.Create = { /* ...default values... */ };

const CreateForm: React.FC<IProps> = ({ children, onError, onSettled, onSuccess, className }) => {
  const mutation = useMutation<Types.IForm.Create, unknown, FormValues>({
    mutationFn: async values => {
      const { data } = await Api.Create(values);
      return Mappers.Create(data);
    },

    onSuccess: data => {
      toast.success('User successfully created');
      onSuccess?.(data);
    },

    onError: error => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
      onError?.(message);
    },

    onSettled
  });

  const form = useForm<FormValues>({
    defaultValues: defaults,
    mode: 'onChange',
    resolver: zodResolver(validationSchema)
  });

  useEffect(() => {
    form.reset({
      ...defaults
    });
  }, []);

  const onSubmit = form.handleSubmit(values => {
    mutation.mutate(values, {
      onSettled: () => {
        form.reset({
          ...form.getValues()
        });
      }
    });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={className}>
        {children({
          ...form,
          isLoading: mutation.isPending
        })}
      </form>
    </FormProvider>
  );
};

export default CreateForm;
```

Rules for forms:
- Always use `react-hook-form` for form state/handling.
- Always use `zod` for validation, defined in `schema.ts`.
- Always export from `index.ts`.
- Mutation success/error should use `sonner` toasts.
- `Update.tsx` follows the same skeleton but calls `Api.Update` and uses
  `Types.IForm.Update`.

### 6.4 `api.ts`

API request functions, built on top of `src/common/services/http.ts`.

```ts
import { http } from '@/common/services';
import * as Types from './types';

import * as ListModule from '@/common/modules/list';
import { AxiosPromise } from 'axios';

export const List = ({ params }: { params?: ListModule.Types.IEntity.Params } = {}) =>
  http.request.get('3/movie/now_playing', {
    params: {
      page: params?.page ?? 1,
      language: params?.language ?? 'en-US',
      region: params?.region
    }
  });

export const Single = ({ id }: { id: number }): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`3/movie/${id}`);
```

### 6.5 `constants.ts` (optional)

Reusable constants for the module (enums, default values, option lists, etc.).

### 6.6 `mappers.ts`

Maps raw API responses to typed entities. Use `radash`'s `get` for safe
property access with defaults.

```ts
import { get } from 'radash';
import * as Types from './types';

import * as ListModule from '@/common/modules/list';

export const Movie = (src: any): Types.IEntity.Movie => {
  return {
    adult: get(src, 'adult', false),
    backdropPath: get(src, 'backdrop_path', ''),
    genreIds: get(src, 'genre_ids', []),
    id: get(src, 'id', 0)
    // ...
  };
};

export const List = (src: any): Types.IQuery.List => ({
  results: get(src, 'results', []).map(Movie)
});
```

### 6.7 `types.ts`

All types for API requests/responses, entities, queries, and forms live here,
namespaced by purpose.

```ts
import * as ListModule from '@/common/modules/list';

export declare namespace IApi {
  // types for api.ts
  export namespace List {
    export interface Response {}
  }

  export namespace Single {
    export interface Response {}
  }

  export interface Movie {}
}

export declare namespace IEntity {
  // entity types
  export interface Movie {}
}

export declare namespace IQuery {
  // query (hook return) types
  export interface List {}
  export interface Single {}
}

export declare namespace IForm {
  // form types
  export interface Create {}
}
```

### 6.8 `index.ts` (module root)

Re-exports everything in the module.

```ts
export * as Hooks from './hooks';
export * as Forms from './forms';
export * as Api from './api';
export * as Types from './types';
export * as Mappers from './mappers';
```

---

## 7. `pages` Folder

**Purpose:** route-level components that compose feature modules and
reusable components into screens.

**Example pages:**
```
pages/
├── Auth/
├── Home/
├── Profile/
├── Settings/
└── Users/
```

### 7.1 Required files/folders inside each page

```
pages/<Name>/
├── components/          # optional, page-specific reusable components
│   ├── form/            # if the page has a form
│   ├── table/           # if the page has a table
│   └── ...
├── <Name>.tsx            # main page component
├── <Name>.module.css     # main page style file
└── index.ts              # exports the main file
```

Rules:
- `components/` is only created if the page needs page-specific UI pieces
  that aren't reusable enough to live in the global `src/components` (§5).
- Group related UI into subfolders inside `components/` (`form/`, `table/`,
  etc.) rather than flat files.
- `index.ts` exports the page's main component as the default/named export.

---

## 8. Summary of Conventions

| Concern              | Tool / Pattern                                                          |
|----------------------|---------------------------------------------------------------------------|
| Data fetching        | TanStack Query (`useQuery`, `useMutation`)                                |
| Form state           | `react-hook-form`                                                         |
| Form validation      | `zod` (in `schema.ts`)                                                    |
| Safe object access   | `radash` (`get`)                                                          |
| HTTP client          | `src/common/services/http.ts` (Axios, via `axios.create()`)               |
| Storage              | `src/common/services/storage.ts` (`store2`)                               |
| Toast notifications  | `sonner`                                                                   |
| Component styling    | CSS Modules + `clsx`                                                       |
| Component props type | `IProps`, defined inline in the component's `.tsx` file                   |
| Raster images        | `src/assets/images`                                                       |
| SVGs                 | `src/assets/svg`                                                          |
| Naming: create form  | `Create.tsx`                                                               |
| Naming: update form  | `Update.tsx`                                                               |
| Module exports       | Always via `index.ts`, namespaced (`Hooks`, `Api`, `Types`, `Mappers`, `Forms`) |

---

## 9. AI Implementation Checklist

### 9.1 When adding a new feature module (`src/modules/<name>`)

1. Create `modules/<name>/` with `hooks/`, `forms/`, `api.ts`, `mappers.ts`,
   `types.ts`, `index.ts` (and `constants.ts` if needed).
2. Define types first in `types.ts` (`IApi`, `IEntity`, `IQuery`, `IForm`).
3. Implement `api.ts` calls using `http` from `@/common/services`.
4. Implement `mappers.ts` to convert raw API responses to typed entities,
   reusing shared list mappers from `@/common/modules/list` if applicable.
5. Implement `hooks/useList.tsx` and/or `hooks/useSingle.tsx` (or other
   hooks) using the API + mappers + TanStack Query, then export via
   `hooks/index.ts`.
6. If the module needs forms, implement `forms/Create.tsx` and/or
   `forms/Update.tsx` with `schema.ts` for zod validation, then export via
   `forms/index.ts`.
7. Export everything from the module's root `index.ts`.
8. If a page is needed, create `pages/<Name>/` with the main component,
   its `.module.css`, an `index.ts`, and a `components/` folder only if
   page-specific UI is required.

### 9.2 When adding a new reusable UI component (`src/components/<Name>`)

1. Inspect existing components before creating a new one; follow the closest
   existing pattern.
2. Create a dedicated component directory: `src/components/<Name>/`.
3. Create the main `<Name>.tsx` file.
4. Create a corresponding `<Name>.module.scss` file when the component
   requires styling.
5. Create an `index.ts` export file.
6. Define component props as `IProps` inside the main `.tsx` file.
7. Use CSS Modules for component-specific styles; use `clsx` for combining
   or conditionally applying classes.
8. Keep component-specific subcomponents inside the component's local
   `components/` directory rather than the global `src/components`.
9. Avoid creating global components for logic only used by one parent
   component.
10. Reuse existing infrastructure (`common/services`, `common/modules`,
    `common/utils`) instead of duplicating implementations.

---

## 10. Do Not

The AI agent must not:

- Create a reusable component as a single loose `.tsx` file directly under
  `src/components` — it must have its own directory (§5.1).
- Create duplicate Axios instances when `common/services/http.ts` can be
  reused.
- Create duplicate `store2` storage configurations when
  `common/services/storage.ts` can be reused.
- Put SVG files inside `src/assets/images`, or raster images inside
  `src/assets/svg`.
- Duplicate an existing list type or mapper already in `common/modules`.
- Create unnecessary global components for parent-specific internal UI.
- Create a separate `types.ts` file for a simple component's props when
  they're only used by that component.
- Replace CSS Modules with another styling approach without an explicit
  project-level decision.
- Introduce new libraries to solve a problem existing project dependencies
  already solve.
- Refactor unrelated code while implementing a requested component or
  feature.
- Introduce additional top-level `src` directories without an explicit new
  architectural rule.

---

## 11. Priority Rule

When these rules conflict with an already established project pattern, the
AI must first inspect the surrounding code and identify the current
convention. The AI should preserve consistency with the existing
architecture rather than introducing a second competing pattern.

If a requested change requires breaking an architectural rule, the AI should
explicitly identify the conflict before making the change.