function XHRRequest() {
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'https://example.com/endpoint');
    xhr.setRequestHeader('Accept');
    xhr.onload = handleResponse;
    xhr.send()
}

function handleResponse() {
    if (xhr.status === 200) {
      console.log('Response:', JSON.parse(xhr.responseText));
    } else {
      console.error('Error:', xhr.statusText);
    }
}  