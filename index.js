const isReact = module => {
  return module === 'react'
}

const isReactNative = module => {
  return module === 'react'
}

const isReactNativeModule = module => {
  return module.startsWith('react-native')
}

const isScopedModule = module => {
  return module.startsWith('@')
}

const hasAlias = aliases => imported =>
  aliases.some(
    alias => imported.moduleName === alias || imported.moduleName.startsWith(`${alias}/`),
  )

const fn = (styleApi, _, { alias: aliases = [], overrideBuiltinModules = true } = {}) => {
  const {
    alias,
    and,
    or,
    always,
    hasDefaultMember,
    hasNamedMembers,
    hasNamespaceMember,
    hasNoMember,
    hasOnlyDefaultMember,
    hasOnlyNamedMembers,
    hasOnlyNamespaceMember,
    isAbsoluteModule,
    isRelativeModule,
    member,
    name,
    not,
    startsWithAlphanumeric,
    startsWithLowerCase,
    startsWithUpperCase,
    moduleName,
    unicode,
    naturally,
  } = styleApi

  const isAliasModule = hasAlias(aliases || [])

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },

    { separator: true },

    {
      match: moduleName(isReact),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {
      match: moduleName(isReactNative),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {
      match: moduleName(isReactNativeModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },

    { separator: true },

    {
      match: moduleName(isScopedModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },

    { separator: true },

    // import * as _ from "bar";
    {
      match: and(
        hasOnlyNamespaceMember,
        isAbsoluteModule,
        not(member(startsWithAlphanumeric)),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },
    // import * as Foo from "bar";
    {
      match: and(
        hasOnlyNamespaceMember,
        isAbsoluteModule,
        member(startsWithUpperCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },

    // import _, * as bar from "baz";
    {
      match: and(
        hasDefaultMember,
        hasNamespaceMember,
        isAbsoluteModule,
        not(member(startsWithAlphanumeric)),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },
    // import Foo, * as bar from "baz";
    {
      match: and(
        hasDefaultMember,
        hasNamespaceMember,
        isAbsoluteModule,
        member(startsWithUpperCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },
    // import foo, * as bar from "baz";
    {
      match: and(
        hasDefaultMember,
        hasNamespaceMember,
        isAbsoluteModule,
        member(startsWithUpperCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },

    // import _ from "bar";
    {
      match: and(
        hasOnlyDefaultMember,
        isAbsoluteModule,
        not(member(startsWithAlphanumeric)),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },
    // import Foo from "bar";
    {
      match: and(
        hasOnlyDefaultMember,
        isAbsoluteModule,
        member(startsWithUpperCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },
    // import foo from "bar";
    {
      match: and(
        hasOnlyDefaultMember,
        isAbsoluteModule,
        member(startsWithLowerCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },

    // import _, {bar, …} from "baz";
    {
      match: and(
        hasDefaultMember,
        hasNamedMembers,
        isAbsoluteModule,
        not(member(startsWithAlphanumeric)),
        not(isAliasModule),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import Foo, {bar, …} from "baz";
    {
      match: and(
        hasDefaultMember,
        hasNamedMembers,
        isAbsoluteModule,
        member(startsWithUpperCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import foo, {bar, …} from "baz";
    {
      match: and(
        hasDefaultMember,
        hasNamedMembers,
        isAbsoluteModule,
        member(startsWithLowerCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },

    // import {_, bar, …} from "baz";
    {
      match: and(
        hasOnlyNamedMembers,
        isAbsoluteModule,
        not(member(startsWithAlphanumeric)),
        not(isAliasModule),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {Foo, bar, …} from "baz";
    {
      match: and(
        hasOnlyNamedMembers,
        isAbsoluteModule,
        member(startsWithUpperCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {foo, bar, …} from "baz";
    {
      match: and(
        hasOnlyNamedMembers,
        isAbsoluteModule,
        member(startsWithLowerCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import * as foo from "bar";
    {
      match: and(
        hasOnlyNamespaceMember,
        isAbsoluteModule,
        member(startsWithLowerCase),
        not(isAliasModule),
      ),
      sort: member(unicode),
    },

    { separator: true },

    // import * as Foo from "{alias}/bar";
    {
      match: and(
        hasOnlyNamespaceMember,
        isAbsoluteModule,
        member(startsWithUpperCase),
        isAliasModule,
      ),
      sort: member(unicode),
    },
    // import * as foo from "{alias}/bar";
    {
      match: and(
        hasOnlyNamespaceMember,
        isAbsoluteModule,
        member(startsWithLowerCase),
        isAliasModule,
      ),
      sort: member(unicode),
    },

    { separator: true },

    // import "{alias}/foo"
    {
      match: and(isAbsoluteModule, isAliasModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },

    { separator: true },

    // import * as _ from "./bar";
    {
      match: and(hasOnlyNamespaceMember, isRelativeModule, not(member(startsWithAlphanumeric))),
      sort: member(unicode),
    },
    // import * as Foo from "./bar";
    {
      match: and(hasOnlyNamespaceMember, isRelativeModule, member(startsWithUpperCase)),
      sort: member(unicode),
    },
    // import * as foo from "./bar";
    {
      match: and(hasOnlyNamespaceMember, isRelativeModule, member(startsWithLowerCase)),
      sort: member(unicode),
    },

    // import _, * as bar from "./baz";
    {
      match: and(
        hasDefaultMember,
        hasNamespaceMember,
        isRelativeModule,
        not(member(startsWithAlphanumeric)),
      ),
      sort: member(unicode),
    },
    // import Foo, * as bar from "./baz";
    {
      match: and(
        hasDefaultMember,
        hasNamespaceMember,
        isRelativeModule,
        member(startsWithUpperCase),
      ),
      sort: member(unicode),
    },
    // import foo, * as bar from "./baz";
    {
      match: and(
        hasDefaultMember,
        hasNamespaceMember,
        isRelativeModule,
        member(startsWithUpperCase),
      ),
      sort: member(unicode),
    },

    // import _ from "./bar";
    {
      match: and(hasOnlyDefaultMember, isRelativeModule, not(member(startsWithAlphanumeric))),
      sort: member(unicode),
    },
    // import Foo from "./bar";
    {
      match: and(hasOnlyDefaultMember, isRelativeModule, member(startsWithUpperCase)),
      sort: member(unicode),
    },
    // import foo from "./bar";
    {
      match: and(hasOnlyDefaultMember, isRelativeModule, member(startsWithLowerCase)),
      sort: member(unicode),
    },

    // import _, {bar, …} from "./baz";
    {
      match: and(
        hasDefaultMember,
        hasNamedMembers,
        isRelativeModule,
        not(member(startsWithAlphanumeric)),
      ),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import Foo, {bar, …} from "./baz";
    {
      match: and(hasDefaultMember, hasNamedMembers, isRelativeModule, member(startsWithUpperCase)),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import foo, {bar, …} from "./baz";
    {
      match: and(hasDefaultMember, hasNamedMembers, isRelativeModule, member(startsWithLowerCase)),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },

    // import {_, bar, …} from "./baz";
    {
      match: and(hasOnlyNamedMembers, isRelativeModule, not(member(startsWithAlphanumeric))),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {Foo, bar, …} from "./baz";
    {
      match: and(hasOnlyNamedMembers, isRelativeModule, member(startsWithUpperCase)),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {foo, bar, …} from "./baz";
    {
      match: and(hasOnlyNamedMembers, isRelativeModule, member(startsWithLowerCase)),
      sort: member(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },
  ]
}

exports.default = fn
