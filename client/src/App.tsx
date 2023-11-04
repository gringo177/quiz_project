import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { default as Comment } from "./assets/comment.svg?react";
import { default as Like } from "./assets/like.svg?react";
import { default as Dislike } from "./assets/dislike.svg?react";

interface IQuestion {
  id: string;
  tip: string;
  answer: string;
  text: string;
  img: string;
  likes: number;
  dislikes: number;
  comments: string[];
}

function App() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((questions) => {
        setQuestions(questions);
        setIndex(0);
      });
  }, []);
  const handleNext = useCallback(() => setIndex(index + 1), [index]);
  const handleLike = useCallback(() => {
    const id = questions[index].id;
    fetch("/api/like/" + id, {
      method: "POST",
    }).then(() =>
      setQuestions(
        questions.map((q) => (q.id !== id ? q : { ...q, likes: ++q.likes }))
      )
    );
  }, [index, questions]);
  const handleDislike = useCallback(() => {
    const id = questions[index].id;
    fetch("/api/dislike/" + id, {
      method: "POST",
    }).then(() =>
      setQuestions(
        questions.map((q) =>
          q.id !== id ? q : { ...q, dislikes: ++q.dislikes }
        )
      )
    );
  }, [index, questions]);

  const handleComment = useCallback(
    (text: string) => {
      const id = questions[index].id;
      fetch("/api/comments/" + id, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(() =>
        setQuestions(
          questions.map((q) =>
            q.id !== id
              ? q
              : { ...q, comments: (q.comments || []).concat(text) }
          )
        )
      );
    },
    [index, questions]
  );

  return !!questions.length && index < questions.length ? (
    <div className="app">
      <h1>
        {index + 1}/{questions.length}
      </h1>
      <Question
        key={index}
        question={questions[index]}
        onNext={handleNext}
        onDislike={handleDislike}
        onLike={handleLike}
        onComment={handleComment}
      />
    </div>
  ) : (
    <div className="app">
      <h1>congratulations! you solved all the riddles</h1>
      <button
        className="button"
        onClick={() => {
          setIndex(0);
        }}
      >
        Try again
      </button>
    </div>
  );
}

export default App;

function Question({
  question,
  onNext,
  onComment,
  onDislike,
  onLike,
}: {
  question: IQuestion;
  onNext: () => void;
  onComment: (text: string) => void;
  onDislike: () => void;
  onLike: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState("");
  const [answer, setAnswer] = useState("");
  const [popup, setPopup] = useState<"next" | "wrong" | null>(null);

  const handleAnswer = () => {
    if (answer.toLowerCase() === question.answer.toLowerCase()) {
      setPopup("next");
    } else {
      setPopup("wrong");
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <>
      <div className="top">
        <div style={{ width: "40%" }}>
          <h2 className="text">{question.text}</h2>
          <input
            ref={inputRef}
            className="input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleAnswer()}
            placeholder="answer"
          />
        </div>
        <div style={{ width: "40%" }}>
          <img className="image" src={question.img} />
        </div>
      </div>
      <div className="bottom">
        {popup === "wrong" && (
          <>
            <div className="overlay" />
            <div className="popup">
              Tip:&nbsp;{question.tip}
              <button
                className="button"
                onClick={() => {
                  setPopup(null);
                }}
              >
                Try again!
              </button>
            </div>
          </>
        )}
        {popup === "next" && (
          <>
            <div className="overlay" />
            <div className="popup">
              You are right!
              <button
                className="button"
                onClick={() => {
                  setPopup(null);
                  onNext();
                }}
              >
                Next question!
              </button>
            </div>
          </>
        )}
        <div className="hint">
          <button className="button" onClick={handleAnswer}>
            Answer
          </button>
        </div>
        <div className="social">
          <span onClick={onLike}>
            <Like />
            &nbsp;{question.likes}
          </span>
          <span onClick={onDislike}>
            <Dislike />
            &nbsp;{question.dislikes}
          </span>
          <span>
            <Comment />
            &nbsp;{question.comments.length}
          </span>
        </div>
        <div className="comments">
          {!!question.comments?.length && <h3>Comments:</h3>}
          {question.comments?.map((comment, index) => (
            <div className="comment" key={index + "--" + comment}>
              {comment}
            </div>
          ))}
          <textarea
            className="textarea"
            placeholder="Leave comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          {comment && (
            <button
              className="send"
              onClick={() => {
                onComment(comment);
                setComment("");
              }}
            >
              Send comment
            </button>
          )}
        </div>
      </div>
    </>
  );
}
