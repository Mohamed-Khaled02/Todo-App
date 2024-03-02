"use client";
import { Button, Container, Typography } from "@material-ui/core";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Todos from "~/components/Todos";
import CreateTodo from "./_components/CreateTodo";

export default function Home() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Full stack todo app</title>
        <meta name="description" content="Full stack todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #0f1235, #090920)",
        }}
      >
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "white",
          }}
        >
          {sessionData && (
            <div
              style={{
                display: "grid",
                gap: "8px",
                gridTemplateColumns: "1fr",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "16px",
                  color: "white",
                }}
              >
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  Todos
                </Typography>
                <Todos />
                <CreateTodo />
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Typography
                variant="body1"
                align="center"
                style={{ color: "white" }}
              >
                {sessionData && (
                  <span>Logged in as {sessionData.user?.email}</span>
                )}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  margin: "auto",
                  backgroundColor: "#2196F3",
                }}
              >
                {sessionData ? "Sign out" : "Sign in"}
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
