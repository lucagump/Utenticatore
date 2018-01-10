const fetch=require('node-fetch');

const root = process.env.SERVER_URL || 'http://localhost:8080/v1'

test('BASIC GET AND POST', () => {
 return fetch(root+'/user', {
  method: 'POST',
  headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: "username=root&password=toor&age=18&city=Roma"
 })
 .then(postRes => {return postRes.json()})
 .then(postData => {
  var x = postData.username;
  var y = postData.password;
  console.log(x);
  console.log(y);
  return fetch(root+"/login?username="+x+"&password=toor", {
   method: 'GET',
   headers: {
             'Accept': 'application/json'
         }
  })
 })
 .then(getRes => { return getRes.json()})
 .then(getData => {
  console.log(getData);
  expect(getData[0].city).toBe("Roma")})
});

test('BASIC DELETE', () => {
 //expect.assertions(1);
 return fetch(root+"/user/root", {
   method: 'DELETE',
   headers: {
             'Accept': 'application/json'
         }
 })
 .then(getRes => { expect(getRes.status).toBe(207)})
});
