create table tbatividades (
    id serial primary key,
    titulo varchar(150) not null,
    descricao text,
    data date not null,
    hora time not null,
    local varchar(100) not null,
    palestrante varchar(150),
    vagas int not null
);

ALTER TABLE tbatividades ADD COLUMN tipo VARCHAR(100);


INSERT INTO tbatividades (tipo, titulo, data, hora, palestrante, descricao, local, vagas)
VALUES
('Palestra', 'Inovação e Mercado Digital', '2025-09-26', '10:00', 'João Santos',
 'Uma palestra sobre as tendências e inovações no mercado digital, com foco em novas oportunidades de negócios.',
 'Auditório', 80),

('Workshop', 'Desenvolvimento Web com HTML e CSS', '2025-09-29', '09:00', 'Ana Oliveira',
 'Oficina prática para iniciantes em desenvolvimento front-end, aprendendo a criar páginas modernas e responsivas.',
 'Laboratório de Informática 212', 25),

('Palestra', 'Tendências em JavaScript', '2025-10-04', '15:00', 'Carlos Lima',
 'Descubra as novidades do ecossistema JavaScript e as tecnologias mais promissoras para os próximos anos.',
 'Auditório', 60),

('Oficina', 'Marketing Digital para Pequenos Negócios', '2025-10-10', '14:00', 'Beatriz Almeida',
 'Aprenda estratégias práticas de marketing digital para impulsionar pequenas empresas e empreendedores locais.',
 'Sala 203', 30),

('Mesa Redonda', 'Futuro da Educação Profissional no Brasil', '2025-10-15', '19:00', 'Equipe Senac Catalão',
 'Discussão sobre os desafios e perspectivas da educação profissional no cenário brasileiro contemporâneo.',
 'Auditório', 100);

 INSERT INTO tbatividades (tipo, titulo, data, hora, palestrante, descricao, local, vagas)
VALUES
('Painel', 'Tecnologia e Sustentabilidade: O Futuro das Cidades Inteligentes', '2025-10-20', '16:00', 'Mariana Ribeiro',
 'Debate sobre como a tecnologia pode contribuir para o desenvolvimento sustentável e inteligente das cidades brasileiras.',
 'Auditório', 70),

('Seminário', 'Empreendedorismo e Inovação no Mundo Pós-Digital', '2025-10-25', '09:30', 'Ricardo Menezes',
 'Encontro voltado para profissionais e estudantes interessados em novas formas de empreender no cenário digital e colaborativo.',
 'Sala 209', 50);
