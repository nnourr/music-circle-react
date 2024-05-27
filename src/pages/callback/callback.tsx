import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SERVER_ENDPOINT } from "../../config/globals";
function CallbackPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [searchParams] = useSearchParams()
  console.log(searchParams);
  
  const loginCode = searchParams.get('code')
  
  if (loginCode === null) {
    return <div>login error</div>
  }

  function handleUsername(field: string) {
    setUsername(field)
  }

  function handleEmail(field: string) {
    setEmail(field)
  }

  const handleSubmit = async () => {
    console.log(username);
    
    await fetch(SERVER_ENDPOINT+'/user/' + email, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({"loginCode": loginCode, "username": username})
    })
  }

  return (
      <div className="flex justify-center items-center">
      <label>
        username:
        <input type="text" onChange={(change) => {handleUsername(change.target.value)}}/>
      </label>
      <label>
        email:
        <input type="text" onChange={(change) => {handleEmail(change.target.value)}}/>
      </label>
      <button type="submit" onClick={() => handleSubmit()}>submit</button>
    </div>
  );
}

export default CallbackPage;
