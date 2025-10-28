# Things that are lacking in the assignment

- Some of the code examples and explanations didn't mention some things that are
  needed to have a functioning app
- Test before() is running synchronously, so it's a gamble whether the test is
  passes or not
- The test order is not great, if database functionality is tested before inserting
  a user/after initializing a database without any users the tests requiring
  authentication will fail
