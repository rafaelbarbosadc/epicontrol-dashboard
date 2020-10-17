import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
} from "recharts";

function Home() {
  const [tests, setTests] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getTestsData();
    setInterval(() => {
      getTestsData();
    }, 1000 * 4);
  }, []);

  const getTestsData = async () => {
    console.log("calling data");
    try {
      const tests = await api.get("/test");
      setTests(tests.data);
      const testsByResult = await api.get("/testsByResult");
      setChartData(testsByResult.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <div className="item-container">
        <h1>Últimos testes realizados</h1>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Horário</th>
              <th>Resultado</th>
              <th>Confiabilidade</th>
            </tr>
          </thead>
          <tbody name="tests-list" is="transition-group">
            <TransitionGroup className="tests-list" component={null}>
              {tests.map(({ _id, user, createdAt, result, accuracy }) => (
                <CSSTransition key={_id} timeout={500} classNames="test">
                  <tr>
                    <td>{user.name}</td>
                    <td>{new Date(createdAt).toLocaleTimeString()}</td>
                    <td className={`${result ? "approved" : "reproved"}`}>
                      {result ? "Aprovado" : "Reprovado"}
                    </td>
                    <td>{`${accuracy * 100}%`}</td>
                  </tr>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </tbody>
        </table>
      </div>
      <div className="item-container">
        <h1>Resultado dos testes</h1>
        <ResponsiveContainer width="95%" height="100%">
          <PieChart width={1200}>
            <Pie
              isAnimationActive={true}
              startAngle={0}
              endAngle={360}
              dataKey={"value"}
              data={chartData}
              outerRadius={250}
              cx="50%"
              cy="50%"
              label
            >
              {chartData.map((entry, index) => (
                <Cell fill={entry.name === "Sucesso" ? "green" : "red"} />
              ))}
            </Pie>
            <Legend verticalAlign="top" height={36} />

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Home;
