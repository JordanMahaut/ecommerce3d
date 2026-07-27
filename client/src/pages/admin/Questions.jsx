import useAdminQuestions from "../../hooks/admin/useAdminQuestions";

export default function Questions() {
  const {
    questions,
    loading,
    error,
  } = useAdminQuestions();

  if (loading) {
    return <p>Chargement des questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <div>
        <h1>Questionnaire</h1>
        <p>Gérez les questions du formulaire de devis.</p>
      </div>

      {questions.length === 0 ? (
        <p>Aucune question enregistrée.</p>
      ) : (
        <div>
          {questions.map((question) => (
            <article key={question.id}>
              <h2>{question.label}</h2>

              <p>Type : {question.type}</p>
              <p>
                Obligatoire : {question.isRequired ? "Oui" : "Non"}
              </p>
              <p>
                Active : {question.isActive ? "Oui" : "Non"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}