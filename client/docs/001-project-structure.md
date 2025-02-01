# 1. Project Structure
> [!IMPORTANT]  
> To see how to work with pages, please check out this [Next.JS Page Router documentation](https://nextjs.org/docs/pages).

> [!IMPORTANT]  
> Components and other type of files should be camel-case. Not `oldComponent.tsx` but `new-component.tsx`.
>  
> However, the function or constant's name within those file should be capitalized like `function thisIsAFunction() {}` or `const thisIsAConstant`

> [!NOTE]
> Although you can default export components (`export default function ...`)
>
> It is recommended to named export them to keep the components naming exact and consistent on imports (`export function ...`). However, for pages component, export them as default since Next.JS won't work if you don't do that.


## 1.1 Src folder structure
```sh
src/
├─ app/               # the app folder
│  ├─ layout.tsx      # the main layout
│  ├─ page.tsx        # the main page
├─ feature/           # represent a certain feature of our application
├─ pages/             # pages that our website comprises of, it is a combination of features
├─ libs/              # global libraries that are SHARED between features
├─ components/        # components that ARE used across many features

```

Excluding the addition of the `feature` folder, this looks like your typical Next.JS project. The inclusion of the feature folder is for organizational purposes. We should utilize it to organize high-level features like `attendance`, `judging`, `application`, etc into its own separate folder.

## 1.2 Feature folder structure
By placing every components, hooks, stores, types, utils, api, assets, etc as near as possible to the closest feature scope:
- you can easily locate components, functionalities, or files related to a feature
- you can easily reason about the component's functionality.
- you can acquire the benefits from separating areas of concern-- allowing for teams to work with minimal conflicts.

Expect every features folder to look like this:

```sh
src/
├─ * other folders */
├─ features/
│  ├─ attendance/
│  │  ├─ hooks/       # hook folder related to attendance feature
│  │  ├─ components/  # component folder related to attendance feature
│  │  ├─ utils/       # helper function folder related to attendance feature
│  │  ├─ stores/      # store folder related to attendance feature
│  │  ├─ api/         # api folder related to attendance feature
│  │  ├─ types/       # types folder related to attendance feature
│  │  ├─ assets/      # assets folder related to attendance feature
│  ├─ application/
│  │  ├─ api/
│  │  │  ├─ application.ts
│  │  ├─ components/
│  │  │  ├─ application-form.tsx/
│  │  │  ├─ application-status.tsx/
│  │  │  ├─ application-table.tsx
│  │  │  ├─ create-btn.tsx
│  │  ├─ stores/
│  │  │  ├─ application-store.tsx
```

### Important notes
You shouldn't create all these folders within an feature immediately, you should create them on the go (until it is needed). Follow the structure of both the `attendance` and the `application` feature folder outlined above, and make sure every file (components, helper function, etc) are **camel-case** (meaning no capitalized letter).

If any components, hooks, or a file is shared between two features (say between `attendance` and `application`), you should trust your intuition on where it meaningfully belong to.
- say `application` has a component called `applicant-status.tsx` that allows you to see the application status of a hackathon participant. But this component is also used by `attendance`'s components, then it would still belong to the `application` feature due to the functionality it provides (it provides a function related to the application of a user).
- contact Evan if you are still unclear about the file placement

the files within these feature folders (like a certain component, hook, stores and etc) can and should be encouraged to import from each other.
- for example, `application-form.tsx` should import the `create-btn.tsx` component to compose a complete application form.