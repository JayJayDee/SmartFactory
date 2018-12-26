import { injectable } from "../lib";

injectable('A', ['B'], async () => 'A');
injectable('B', ['C'], async () => 'A');
injectable('C', ['D'], async () => 'A');
injectable('D', ['E'], async () => 'A');
injectable('E', ['F'], async () => () => 'A');
injectable('F', ['G'], async () => () => 'A');
injectable('G', ['H'], async () => () => 'A');
injectable('H', ['I', 'Config'], async () => () => 'A');
injectable('I', ['J', 'L', 'K', 'Config'], async () => () => 'A');
injectable('J', ['K'], async () => () => 'A');
injectable('K', ['L', 'Config'], async () => () => 'A');
injectable('L', ['Config'], async () => () => 'A');