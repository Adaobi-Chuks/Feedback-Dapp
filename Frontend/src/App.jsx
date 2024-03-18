import './App.css'

function App() {

  return (
    <>
    <div className='container'>
      <h1 className='title'>Feedback DApp</h1>
      <div className='connect-wallet-btn'>Connect Wallet</div>
      <form>
        <div>
          <label for="feedbackMessage">Feedback Message:</label>
          <textarea id="feedback" name="feedbackMessage" rows="4" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Submit Feedback</button>
        <div className='feedbacks' id='feedbacks'></div>
      </form>
    </div>
    </>
  )
}

export default App
