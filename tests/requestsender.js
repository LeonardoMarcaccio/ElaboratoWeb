const url = 'http://192.168.1.9/tests/test.php';

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': '0',
    },
});

const text = await response.text();

console.log(text);
