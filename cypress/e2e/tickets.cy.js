describe('Ticket tests', () => {

  let ticketId;

  it("Deve criar um novo ticket com sucesso1", () => {
    cy.request("POST", `/tickets`, {
      userId: 12,
      description: "Ticket 1",
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      ticketId = response.body.id;
    });
  });

  it("Deve trazer um ticket", () => {
    cy.wrap(null).should(() => {
      expect(ticketId).to.exist;
    });

    cy.request("GET", `/tickets/${ticketId}`).should((response) => {
      console.log("Tickets", response);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', ticketId);
      expect(response.body).to.have.property('description', 'Ticket 1');
    });
  });

  it("Deve atualizar o status do ticket", () => {
    cy.wrap(null).should(() => {
      expect(ticketId).to.exist;
    });

    cy.request("PUT", `/tickets/${ticketId}/status`, {
      status: "In Progress",
    }).then((response) => {
      console.log("Ticket Atualizado", response);
      expect(response.status).to.eq(200);
      //expect(response.body.user).to.have.property('name', "Mauro Alteradoo");
    });
  });

  it('Deve deletar um ticket recém criado', () => {
    cy.wrap(null).should(() => {
      expect(ticketId).to.exist;
    });

    cy.request("DELETE", `/tickets/${ticketId}`).then((response) => {
      console.log("Delete ticket", response);
      expect(response.status).to.eq(200);
    })
  });

});