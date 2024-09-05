
## 一起干翻next-auth@5.0系列(五): 集成SQLite支持账号注册 



1. 利用prismaAdapter 来进行link

await events.createUser?.({ user })

await linkAccount({ ...account, userId: user.id })

-  在绑定页面注入account的信息
-  收集用户账户和密码,利用account创建的user信息创建user